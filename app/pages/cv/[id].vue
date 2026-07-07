<script setup lang="ts">
import { useCvDetail } from './_detail'
import CvToolbar from './_toolbar.vue'

const { cv, form, list, isPreview, GDPR_TEXT } = useCvDetail()
</script>

<template>
  <section class="container" style="max-width: 20cm; min-height: 20cm;">

    <!-- TOOLBAR -->
    <CvToolbar :is-preview="isPreview" 
                :form="form" 
                :cv-id="$route.params.id as string" />

    <!-- OLD TOOLBAR (commented out)
    <div data-toolbar class="sticky-top py-2 text-bg-light shadow-sm" style="top: 3.5rem">
      <div class="px-2 d-flex gap-1 align-items-center">
          
        <NuxtLink :to="'/cv/list'" class="p-1 btn btn-sm btn-outline-dark">
          <i class="bi bi-chevron-left me-1"></i> 
          <span class="d-none d-sm-inline">Indietro</span>
        </NuxtLink>

        <template v-if="isPreview">
          <button @click="printCV()" 
                  class="p-1 btn btn-sm btn-outline-secondary me-2">
            <i class="bi bi-printer me-1"></i>
            <span class="d-none d-sm-inline">Stampa/PDF</span>
          </button>
          <NuxtLink :to="`/cv/${$route.params.id}`" 
                    class="ms-auto p-1 btn btn-sm btn-primary">
            <i class="bi bi-pencil me-1"></i>
            <span class="d-none d-sm-inline">Modifica</span>
          </NuxtLink>
        </template>

        <template v-else>
          <span class="ms-auto d-flex align-items-center gap-1 text-nowrap">
            <template v-if="form.loading.message === 'Salvataggio...'">
              <i class="bi bi-hourglass-split text-info autosave-pulse"></i>
              <span class="d-none d-sm-inline text-info small">Salvataggio...</span>
            </template>
            <template v-else-if="form.loading.color === 'success'">
              <i class="bi bi-check-circle-fill text-success"></i>
              <span class="d-none d-sm-inline text-success small">Salvato</span>
            </template>
            <template v-else-if="form.loading.color === 'warning'">
              <i class="bi bi-exclamation-triangle-fill text-warning"></i>
              <span class="d-none d-sm-inline text-warning small">{{ form.loading.message }}</span>
            </template>
          </span>
                        
          <NuxtLink :to="`/cv/${$route.params.id}?preview`" 
                    class="p-1 btn btn-sm btn-success text-nowrap">
            <i class="bi bi-eye me-1"></i>
            <span class="d-none d-sm-inline">Preview</span>
          </NuxtLink>
        </template>
        
      </div>
    </div>
    -->

    <div data-page class="container text-bg-light shadow" @input="form.handle_change">
      <!-- HEADER -->
      <div class="row align-items-center">
        <div v-if="cv?.image || !isPreview" class="col-12 col-sm-auto">
          <img v-if="cv?.image" :src="cv?.image" 
                alt="Imagine profilo"
                class="mx-2 border rounded-circle"
                style="width: 6cm; height: 6cm; object-fit: cover;">
          
          <div v-else class="bg-secondary border rounded-circle" 
                style="width: 6cm; height: 6cm"></div>
  
          <Field v-if="!isPreview" field-key="image"
                  :value="form.fields_obj.value.image?.value"
                  :label="form.fields_obj.value.image?.label"
                  input_class="form-control-sm"/>
        </div>
          
        <div class="col-12 col-sm">
          <!-- Title -->
          <h1 v-if="isPreview" class="fs-3">{{ cv?.title }}</h1>
          <Field v-else field-key="title"
                  :value="form.fields_obj.value.title?.value"
                  :hidden_label="form.fields_obj.value.title?.label"
                  :asterisk="form.fields_obj.value.title?.asterisk"
                  :validation="form.fields_obj.value.title?.validation as (val: any) => boolean"
                  :error-message="form.fields_obj.value.title?.errorMessage"
                  input_class="fs-3"/>
          
          <!-- Subtitle -->
          <h3 v-if="isPreview" class="fs-5 mt-2 pt-2 border-top border-dark">{{ cv?.subtitle }}</h3>
          <Field v-else field-key="subtitle"
                  :value="form.fields_obj.value.subtitle?.value"
                  :hidden_label="form.fields_obj.value.subtitle?.label"
                  input_class="fs-5"
                  class="mt-2 pt-2 border-top border-dark"/>
          
          <!-- Description -->
          <p v-if="isPreview">{{ cv?.description }}</p>
          <Field v-else field-key="description"
                  :value="form.fields_obj.value.description?.value"
                  :hidden_label="form.fields_obj.value.description?.label"
                  type="textarea" :rows="5"
                  input_class="form-control-sm"/>
        </div>
      </div>
      
      <!-- BODY -->
      <div class="row">
        <div class="col-12 col-sm-6">
          <!-- HARD SKILLS -->
          <div class="mt-4 pt-2 border-top border-primary"> 
            <div class="d-flex justify-content-between align-items-center"> 
              <h4 class="text-truncate text-primary">
                <i class="bi bi-code"></i> Hard skills
              </h4>
              <button v-if="!isPreview" @click="list.add('hard_skills', {title: '', level: '', description: ''})" 
                      class="btn btn-sm btn-outline-primary text-truncate"> 
                <i class="bi bi-plus-lg"></i> Aggiungi
              </button>
            </div>
            
            <div v-if="isPreview" class="d-grid gap-1" style="grid-template-columns: auto 1fr">
              <template v-for="(hs, index) in cv?.hard_skills" :key="index" >
                <strong>{{ hs.title }}:</strong>
                <span v-if="hs.description">
                  <em v-if="hs.level">(Livello {{ hs.level }})</em>
                  {{ hs.description }}
                </span>
              </template>
            </div>
            <template v-else>
              <div v-for="(hs, index) in cv?.hard_skills" class="d-grid gap-1 align-items-start" 
                    style="grid-template-columns: auto 1fr 1fr 2fr;">
                <button @click="list.remove('hard_skills', index)" 
                        class="p-1 btn btn-sm btn-danger">
                  <i class="bi bi-trash"></i>
                </button>
                <Field :field-key="`hard_skills>${index}>title`" 
                        :value="hs.title" 
                        hidden_label="Titolo hard skill"
                        input_class="form-control-sm"/>
                <Field :field-key="`hard_skills>${index}>level`" 
                        :value="hs.level"
                        hidden_label="Livello hard skill"
                        input_class="form-control-sm"/>
                <Field :field-key="`hard_skills>${index}>description`" 
                        :value="hs.description"
                        hidden_label="Descrizione hard skill" 
                        type="textarea"
                        :rows="3"
                        input_class="form-control-sm"/>
              </div>
            </template>
          </div>
  
          
          <div class="mt-4 pt-2 border-top border-primary"> <!-- CONTATTI -->
            <h4 class="text-primary"> <i class="bi bi-person"></i> Contatti</h4>
            
            <div v-if="isPreview" class="d-grid gap-1" style="grid-template-columns: auto 1fr">
              <template v-if="cv?.birth_date"><strong>Data di nascita:</strong> {{ cv.birth_date }}</template>
              <template v-if="cv?.email"><strong>Email:</strong> {{ cv.email }}</template> 
              <template v-if="cv?.address"><strong>Indirizzo:</strong> {{ cv.address }}</template>
              <template v-if="cv?.phone"><strong>Telefono:</strong> {{ cv.phone }}</template>
              <template v-for="(contact, index) in cv?.contacts" :key="index">
                <strong>{{ contact.title }}:</strong> 
                <a :href="contact.description" target="_blank" rel="noopener noreferrer">
                  {{ contact.description }}
                </a>

              </template>
            </div>
            
            <template v-else>
              <Field inline field-key="birth_date"
                    :value="form.fields_obj.value.birth_date?.value"
                    :label="form.fields_obj.value.birth_date?.label"
                    type="date"
                    input_class="form-control-sm"/>
              <Field inline field-key="email"
                    :value="form.fields_obj.value.email?.value"
                    :label="form.fields_obj.value.email?.label"
                    type="email"
                    :asterisk="form.fields_obj.value.email?.asterisk"
                    :validation="form.fields_obj.value.email?.validation as (val: any) => boolean"
                    :error-message="form.fields_obj.value.email?.errorMessage"
                    input_class="form-control-sm"/>
              <Field inline field-key="address"
                    :value="form.fields_obj.value.address?.value"
                    :label="form.fields_obj.value.address?.label"
                    input_class="form-control-sm"/>
              <Field inline field-key="phone"
                    :value="form.fields_obj.value.phone?.value"
                    :label="form.fields_obj.value.phone?.label"
                    input_class="form-control-sm"/>

              <div v-for="(contact, index) in cv?.contacts" class="py-1 d-grid gap-1 align-items-start" 
                  style="grid-template-columns: auto 1fr 2fr;">
                <button @click="list.remove('contacts', index)" 
                        class="p-1 btn btn-sm btn-danger">
                  <i class="bi bi-trash"></i>
                </button>
                <Field :field-key="`contacts>${index}>title`" 
                        :value="contact.title" 
                        hidden_label="Titolo contatto"
                        input_class="form-control-sm"/>
                <Field :field-key="`contacts>${index}>description`" 
                        :value="contact.description" 
                        hidden_label="Link contatto"
                        input_class="form-control-sm"/>
              </div>
              <button class="my-2 btn btn-sm btn-outline-primary text-truncate" 
                      @click="list.add('contacts', {title: '', description: ''})"> 
                <i class="bi bi-plus-lg"></i> Aggiungi contatto
              </button>
            </template>
          </div>
        
  
          <div class="mt-4 pt-2 border-top border-primary"> <!-- SOFT SKILLS -->
            <div class="d-flex justify-content-between align-items-center"> 
              <h4 class="text-truncate text-primary">
                <i class="bi bi-heart"></i> 
                Soft skills
              </h4>
              <button v-if="!isPreview" @click="list.add('soft_skills', {title: '', description: ''})" 
                      class="btn btn-sm btn-outline-primary text-truncate"> 
                <i class="bi bi-plus-lg"></i> Aggiungi
              </button>
            </div>
            
            <div v-if="isPreview"
                  class="d-grid gap-1" style="grid-template-columns: auto 1fr;">
              <template v-for="(ss, index) in cv?.soft_skills" :key="index">
                <strong>{{ ss.title }}:</strong>
                <span v-if="ss.description">{{ ss.description }}</span>
              </template>
            </div>
            <template v-else>
              <div v-for="(ss, index) in cv?.soft_skills" 
                    class="d-grid gap-1 align-items-start" 
                    style="grid-template-columns: auto 1fr 2fr;">
                <button @click="list.remove('soft_skills', index)" 
                        class="p-1 btn btn-sm btn-danger">
                  <i class="bi bi-trash"></i>
                </button>
                <Field :field-key="`soft_skills>${index}>title`" 
                        :value="ss.title" 
                        hidden_label="Titolo soft skill" 
                        input_class="form-control-sm"/>
                <Field :field-key="`soft_skills>${index}>description`" 
                        :value="ss.description" 
                        hidden_label="Descrizione soft skill" 
                        type="textarea" 
                        :rows="3"
                        input_class="form-control-sm"/>
              </div>
            </template>
          </div>
          
        </div>
        
  
        <div class="col-12 col-sm-6"> 
          <div class="mt-4 pt-2 border-top border-primary"> <!-- LINGUAGGI -->
            <div class="d-flex justify-content-between align-items-center"> 
              <h4 class="text-truncate text-primary">
                <i class="bi bi-translate"></i> 
                Linguaggi
              </h4>
              <button v-if="!isPreview" @click="list.add('lenguages', {title: '', level: '', description: ''})" 
                      class="btn btn-sm btn-outline-primary text-truncate"> 
                <i class="bi bi-plus-lg"></i> Aggiungi
              </button>
            </div>

            <template v-if="isPreview">
              <div v-for="(lenguage, index) in cv?.lenguages" :key="index" 
                    class="mb-2 d-grid gap-1" style="grid-template-columns: auto 1fr">
                <strong>{{ lenguage.title }}:</strong>
                
                <span v-if="lenguage.description">
                  <em v-if="lenguage.level">({{ lenguage.level }})</em>
                  {{ lenguage.description }} 
                </span>
              </div>
            </template>
            <template v-else>
              <div v-for="(lenguage, index) in cv?.lenguages" 
                    class="d-grid gap-1 align-items-start" 
                    style="grid-template-columns: auto 1fr 1fr 2fr;">
                <button @click="list.remove('lenguages', index)" 
                        class="p-1 btn btn-sm btn-danger">
                  <i class="bi bi-trash"></i>
                </button>
                <Field :field-key="`lenguages>${index}>title`" :value="lenguage.title" hidden_label="Titolo lingua" input_class="form-control-sm"/>
                <Field :field-key="`lenguages>${index}>level`" :value="lenguage.level" hidden_label="Livello lingua" input_class="form-control-sm"/>
                <Field :field-key="`lenguages>${index}>description`" :value="lenguage.description" hidden_label="Descrizione lingua" type="textarea" input_class="form-control-sm"/>
              </div>
            </template>
          </div>
          
          <!-- ESPERIENZE -->
          <div class="mt-4 pt-2 border-top border-primary">
            <div class="d-flex justify-content-between align-items-center">
              <h4 class="text-truncate text-primary">
                <i class="bi bi-briefcase"></i> Esperienze
              </h4>
              <button v-if="!isPreview" @click="list.add('experiences', {start_date: '', role: '', period: '', company: '', description: ''})" 
                      class="btn btn-sm btn-outline-primary text-truncate"> 
                <i class="bi bi-plus-lg"></i> Aggiungi
              </button>
            </div>
            
            <template v-if="isPreview">
              <div v-for="(exp, index) in cv?.experiences" :key="index"
                    class="d-flex gap-3">
                <i class="bi bi-caret-right-fill text-primary"></i>
                <div class="row">
                  <strong class="col text-primary">{{ exp.company }}</strong>
                  <em class="col-auto">{{ exp.period }}</em>
                  <em class="col-12">{{ exp.role }}</em>
                  <p class="col-12">{{ exp.description }}</p>
                </div>
              </div>
            </template>
            <template v-else>
              <div v-for="(exp, index) in cv?.experiences" 
                    class="py-2 d-flex gap-1 align-items-start">
                <button @click="list.remove('experiences', index)" 
                        class="p-1 btn btn-sm btn-danger">
                  <i class="bi bi-trash"></i>
                </button>
                <div>
                  <div class="pb-2 row gap-1 g-0"> <!-- head -->
                    <div class="col-auto">
                      <Field :field-key="`experiences>${index}>company`" 
                              :value="exp.company" 
                              hidden_label="Azienda esperienza"
                              input_class="form-control-sm"/>
                    </div>
                    <div class="col">
                      <Field :field-key="`experiences>${index}>period`" 
                              :value="exp.period" 
                              hidden_label="Periodo esperienza"
                              input_class="form-control-sm"/>
                    </div>
                    <div class="col-12">
                      <Field :field-key="`experiences>${index}>role`" 
                              :value="exp.role" 
                              hidden_label="Ruolo esperienza"
                              input_class="form-control-sm"/>
                    </div>
                  </div>
                  <div> <!-- body -->
                    <Field :field-key="`experiences>${index}>description`" 
                            :value="exp.description" 
                            hidden_label="Descrizione esperienza" 
                            type="textarea" 
                            :rows="3"
                            input_class="form-control-sm"/>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>

      <!-- ALERT -->
      <div class="py-2">
        <div class="alert alert-info d-grid gap-1" 
            style="grid-template-columns: auto 1fr;">
          <i class="bi bi-info-circle"></i>
          <small>{{ GDPR_TEXT }}</small>
        </div>
      </div>
  
    </div>
  </section>
</template>

<style scoped lang="sass">
.form-control
  border-bottom: 1px solid !important
  border-radius: 0

@media print 
  /* rimuove la toolbar */
  [data-toolbar] 
    display: none !important
  
  /* rimuove i pulsanti */
  button, .btn 
    display: none !important
  
  /* formatta la pagina */
  [data-page] 
    box-shadow: none !important
    max-width: 100% !important
    padding: 0 !important
  
</style>
