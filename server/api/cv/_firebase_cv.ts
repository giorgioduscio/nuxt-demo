export const firebase_cv = Object.freeze({
  url: 'https://curriculum-vitae-s-default-rtdb.europe-west1.firebasedatabase.app/cvs',
  to_use(event: any): boolean {
    const host = event.node.req.headers.host || '';
    return !host.includes('localhost') && !host.includes('127.0.0.1');
  },
  
  async create(data: any) {
    const id = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
    const newCV = { ...data, id: Number(id) };
    await $fetch(`${this.url}/${id}.json`, {
      method: 'PUT',
      body: newCV
    });
    return newCV;
  },
  
  async read_id(id: string) {
    const cv = await $fetch(`${this.url}/${id}.json`);
    if (!cv) {
      throw createError({
        statusCode: 404,
        statusMessage: `CV con ID ${id} non trovato`,
      });
    }
    return cv;
  },
  
  async read() {
    const data = await $fetch(`${this.url}.json`);
    if (!data) return [];
    return Object.values(data);
  },
  
  async update(id: string, data: any) {
    const existing = await this.read_id(id);
    const updated = { ...existing, ...data };
    await $fetch(`${this.url}/${id}.json`, {
      method: 'PUT',
      body: updated
    });
    return updated;
  },
  
  async delete(id: string) {
    await this.read_id(id); // Verifica esistenza
    await $fetch(`${this.url}/${id}.json`, {
      method: 'DELETE'
    });
    return {
      success: true,
      message: `CV con ID ${id} eliminato`
    };
  },
  
  async batchDelete(ids: number[]) {
    const results = {
      success: [] as number[],
      failed: [] as Array<{ id: number; error: string }>
    };
    
    for (const id of ids) {
      try {
        await this.delete(id.toString());
        results.success.push(id);
      } catch (error) {
        results.failed.push({ id, error: `Errore durante l'eliminazione del CV ${id}` });
      }
    }
    
    return {
      success: true,
      message: `Eliminati ${results.success.length} CV su ${ids.length}`,
      results
    };
  }
})
