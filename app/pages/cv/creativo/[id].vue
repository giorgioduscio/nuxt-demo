<script setup lang="ts">
import { useCvMain } from '../_cv_main'
import CvToolbar from '../_toolbar.vue'

const { cv, form, list, isPreview, GDPR_TEXT } = useCvMain()
</script>

<template>
  <section class="container" style="max-width: 20cm; min-height: 20cm;">
    <!-- TOOLBAR -->
    <CvToolbar :is-preview="isPreview" 
                :form="form" 
                :cvType="cv.type"
                :cv-id="$route.params.id as string"/>
    <div data-page class="py-2 container text-bg-light shadow" @input="form.handle_change">
      <!-- Il contenuto specifico sarà aggiunto in futuro -->
      <div class="alert alert-info">
        <strong>Creativo</strong> - Contenuto in fase di sviluppo. Attendere aggiornamenti futuri
      </div>
    </div>
  </section>
</template>
