<script setup lang="ts">
import { useEditCv } from './edit'

const { cv, form, list, router, GDPR_TEXT } = useEditCv()
</script>

<template>
  <section class="pb-md-5">
    <div class="p-sm-5 container text-bg-light shadow" 
              style="max-width: 20cm;"
              @input="form.handle_change">
  
      <!-- TOOLS -->
      <div class="py-4 position-relative">
        <div class="position-fixed" style="top: 4rem;">
          <div class="d-flex gap-1 align-items-center">
            
            <button @click="router.back" class="p-1 btn btn-sm btn-secondary">
              <i class="bi bi-arrow-left me-1"></i> 
              <span class="d-none d-md-inline">Indietro</span></button>

            <Field field-key="type"
                   :value="form.fields_obj.value.type?.value"
                   hidden_label="Tipo CV"
                   type="select"
                   :options="form.fields_obj.value.type?.options"/>
            
            <button :class="`p-1 btn btn-sm btn-${form.loading.color || 'primary'} text-nowrap`" 
                    :disabled="!!form.loading.message"
                    @click="form.handle_submit()">
              <span v-if="form.loading.message">
                <i :class="`bi bi-${form.loading.icon}`"></i>
                {{ form.loading.message }}
              </span>
              <span v-else> <i class="bi bi-save"></i> Salva </span>
            </button>
            
          </div>
        </div>
      </div>
  
      <!-- HEADER -->
      <div class="row">
        <div class="col-12 col-md-auto">
          <img v-if="cv?.image" :src="cv?.image" 
                alt="Imagine profilo"
                class="mx-2 border rounded-circle shadow"
                style="width: 6cm; height: 6cm; object-fit: cover;">
  
          <Field field-key="image"
                  :value="form.fields_obj.value.image?.value"
                  :label="form.fields_obj.value.image?.label"/>
        </div>
          
        <div class="col-12 col-md">
          <Field field-key="title"
                  :value="form.fields_obj.value.title?.value"
                  :hidden_label="form.fields_obj.value.title?.label"
                  :asterisk="form.fields_obj.value.title?.asterisk"
                  :validation="form.fields_obj.value.title?.validation as (val: any) => boolean"
                  :error-message="form.fields_obj.value.title?.errorMessage"
                  input_class="fs-3"/>
          <Field field-key="subtitle"
                  :value="form.fields_obj.value.subtitle?.value"
                  :hidden_label="form.fields_obj.value.subtitle?.label"
                  input_class="fs-5"
                  class="mt-2 pt-2 border-top border-dark"/>
          <Field field-key="description"
                  :value="form.fields_obj.value.description?.value"
                  :hidden_label="form.fields_obj.value.description?.label"
                  type="textarea"/>
        </div>
      </div>
      
      <!-- BODY -->
      <div class="row">
        <div class="col-12 col-md-6">
          
          <div class="mt-4 pt-2 border-top  border-dark "> <!-- HARD SKILLS -->
            <div class="d-flex justify-content-between align-items-center"> 
              <h4 class="text-truncate">
                <i class="bi bi-code"></i> 
                Hard skills
              </h4>
              <button @click="list.add('hard_skills', {title: '', level: '', description: ''})" 
                      class="btn btn-sm btn-outline-primary text-truncate"> 
                <i class="bi bi-plus-lg"></i> Aggiungi
              </button>
            </div>
            <div v-for="(hs, index) in cv?.hard_skills" class="d-grid gap-1 align-items-start" 
                  style="grid-template-columns: auto 1fr 1fr 2fr;">
              <button @click="list.remove('hard_skills', index)" 
                      class="p-1 btn btn-sm btn-danger">
                <i class="bi bi-trash"></i>
              </button>
              <Field :field-key="`hard_skills>${index}>title`" 
                      :value="hs.title" 
                      hidden_label="Titolo hard skill"/>
              <Field :field-key="`hard_skills>${index}>level`" 
                      :value="hs.level" 
                      hidden_label="Livello hard skill"/>
              <Field :field-key="`hard_skills>${index}>description`" 
                      :value="hs.description" 
                      hidden_label="Descrizione hard skill" 
                      type="textarea"/>
            </div>
          </div>
  
          
          <div class="mt-4 pt-2 border-top border-dark"> <!-- CONTATTI -->
            <h4> <i class="bi bi-person"></i> Contatti</h4>
            <Field inline field-key="birth_date"
                  :value="form.fields_obj.value.birth_date?.value"
                  :label="form.fields_obj.value.birth_date?.label"
                  type="date"/>
            <Field inline field-key="email"
                  :value="form.fields_obj.value.email?.value"
                  :label="form.fields_obj.value.email?.label"
                  type="email"
                  :asterisk="form.fields_obj.value.email?.asterisk"
                  :validation="form.fields_obj.value.email?.validation as (val: any) => boolean"
                  :error-message="form.fields_obj.value.email?.errorMessage"/>
            <Field inline field-key="address"
                  :value="form.fields_obj.value.address?.value"
                  :label="form.fields_obj.value.address?.label"/>
            <Field inline field-key="phone"
                  :value="form.fields_obj.value.phone?.value"
                  :label="form.fields_obj.value.phone?.label"/>

            <div v-for="(contact, index) in cv?.contacts" class="py-1 d-grid gap-1 align-items-start" 
                style="grid-template-columns: auto 1fr 2fr;">

              <button @click="list.remove('contacts', index)" 
                      class="p-1 btn btn-sm btn-danger">
                <i class="bi bi-trash"></i>
              </button>
              <Field :field-key="`contacts>${index}>title`" :value="contact.title" hidden_label="Titolo contatto"/>
              <Field :field-key="`contacts>${index}>description`" :value="contact.description" hidden_label="Descrizione contatto" type="textarea"/>
            </div>
            <button class="my-2 btn btn-sm btn-outline-primary text-truncate" 
                    @click="list.add('contacts', {title: '', description: ''})"> 
              <i class="bi bi-plus-lg"></i> Aggiungi contatto
            </button>
          </div>
        
  
          <div class="mt-4 pt-2 border-top border-dark"> <!-- SOFT SKILLS -->
            <div class="d-flex justify-content-between align-items-center"> 
              <h4 class="text-truncate">
                <i class="bi bi-heart"></i> 
                Soft skills
              </h4>
              <button @click="list.add('soft_skills', {title: '', description: ''})" 
                      class="btn btn-sm btn-outline-primary text-truncate"> 
                <i class="bi bi-plus-lg"></i> Aggiungi
              </button>
            </div>
            <div v-for="(ss, index) in cv?.soft_skills" class="d-grid gap-2 align-items-start" 
                  style="grid-template-columns: auto 1fr 2fr;">
              <button @click="list.remove('soft_skills', index)" 
                      class="p-1 btn btn-sm btn-danger">
                <i class="bi bi-trash"></i>
              </button>
              <Field :field-key="`soft_skills>${index}>title`" :value="ss.title" hidden_label="Titolo soft skill"/>
              <Field :field-key="`soft_skills>${index}>description`" :value="ss.description" hidden_label="Descrizione soft skill" type="textarea"/>
            </div>
          </div>
          
        </div>
        
  
        <div class="col-12 col-md-6"> 
          <div class="mt-4 pt-2 border-top border-dark"> <!-- LINGUAGGI -->
            <div class="d-flex justify-content-between align-items-center"> 
              <h4 class="text-truncate">
                <i class="bi bi-translate"></i> 
                Linguaggi
              </h4>
              <button @click="list.add('lenguages', {title: '', level: '', description: ''})" 
                      class="btn btn-sm btn-outline-primary text-truncate"> 
                <i class="bi bi-plus-lg"></i> Aggiungi
              </button>
            </div>

            <div v-for="(lenguage, index) in cv?.lenguages" 
                  class="d-grid gap-1 align-items-start" 
                  style="grid-template-columns: auto 1fr 1fr 2fr;">
              <button @click="list.remove('lenguages', index)" 
                      class="p-1 btn btn-sm btn-danger">
                <i class="bi bi-trash"></i>
              </button>
              <Field :field-key="`lenguages>${index}>title`" :value="lenguage.title" hidden_label="Titolo lingua"/>
              <Field :field-key="`lenguages>${index}>level`" :value="lenguage.level" hidden_label="Livello lingua"/>
              <Field :field-key="`lenguages>${index}>description`" :value="lenguage.description" hidden_label="Descrizione lingua" type="textarea"/>
            </div>
          </div>
          
          <!-- ESPERIENZE -->
          <div class="mt-4 pt-2 border-top border-dark">
            <div class="d-flex justify-content-between align-items-center">
              <h4 class="text-truncate">
                <i class="bi bi-briefcase"></i> 
                Esperienze
              </h4>
              <button @click="list.add('experiences', {start_date: '', role: '', period: '', company: '', description: ''})" 
                      class="btn btn-sm btn-outline-primary text-truncate"> 
                <i class="bi bi-plus-lg"></i> Aggiungi
              </button>
            </div>
            
            <div v-for="(exp, index) in cv?.experiences" 
                  class="py-2 d-flex gap-1 align-items-start">
              <button @click="list.remove('experiences', index)" 
                      class="p-1 btn btn-sm btn-danger">
                <i class="bi bi-trash"></i>
              </button>
  
              <div>
                <div class="pb-2 row gap-1 g-0"> <!-- head -->
                  <div class="col-auto" data-company>
                    <Field :field-key="`experiences>${index}>company`" :value="exp.company" hidden_label="Azienda esperienza"/>
                  </div>
                  <div class="col" data-period>
                    <Field :field-key="`experiences>${index}>period`" :value="exp.period" hidden_label="Periodo esperienza"/>
                  </div>
                  <div class="col-12" data-role>
                    <Field :field-key="`experiences>${index}>role`" :value="exp.role" hidden_label="Ruolo esperienza"/>
                  </div>
                </div>
                
                <div> <!-- body -->
                  <Field :field-key="`experiences>${index}>description`" :value="exp.description" hidden_label="Descrizione esperienza" type="textarea"/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ALERT -->
      <div class="my-3 alert alert-info d-grid gap-2" 
          style="grid-template-columns: auto 1fr;">
        <i class="bi bi-info-circle"></i>
        <small>{{ GDPR_TEXT }}</small>
      </div>
  
    </div>
  </section>
</template>

<style scoped lang="sass">
.form-control
  border-bottom: 1px solid !important
  border-radius: 0
</style>