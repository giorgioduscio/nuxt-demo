
export interface FormField {
  type:          string,
  key:           string,
  label:         string,
  value:         any,
  placeholder?:  string,
  message?:      string,
  asterisk?:     boolean,
  validation?:   Function,
  errorMessage?: string,
  options?: {
    label: string,
    value: string | number
  }[],
  section?: string,
  section_icon?: string,
}


/**
 * SCHEMA FORM FIELD
 * Valida la struttura di un campo dinamico del form

export const FormFieldSchema = v.object({
    type:         v.string(),
    key:          v.string(),
    label:        v.string(),
    value:        v.union([v.string(), v.number(), v.boolean()]),
    placeholder:  v.optional(v.string()),
    message:      v.optional(v.string()),
    asterisk:     v.optional(v.boolean()),
    validation:   v.optional(v.function()),
    errorMessage: v.optional(v.string()),
    options: v.optional(  v.array(
        v.object({
            label: v.string(),
            value: v.union([v.string(), v.number()])
        })
    )),
    section: v.optional(v.string()),
    section_icon: v.optional(v.string()),
});

*/