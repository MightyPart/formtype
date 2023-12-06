import { type TObject, Optional, Readonly, Kind } from "@sinclair/typebox";

const getInputType = (format: string, type: string) => (
  format == "email" ? "email"
  : format == "password" ? "password"
  : format == "url" ? "url"
  : type == "integer" ? "number"
  : "text"
)

const htmlStringKeyValue = (key: string|null|undefined, value: string|null|undefined) => {
  if (!key || !value) return ""
  return ` ${key}="${value}"`
}

export const toFormElems = <Validator extends TObject>(validator: Validator) => (
  Object.fromEntries(Object.entries(validator.properties).map(([key, value]) => {
    const {
      placeholder, pattern, minLength, maxLength, minimum, maximum, exclusiveMaximum, exclusiveMinimum, [Optional]:optional, [Readonly]:readonly,
      format, type, [Kind]:kind,
      ...rest
    } = value

    return [
      key,
      `<input${[
        ` type="${getInputType(format, type)}"`,

        ` name="${key}"`,
        ` id="${key}"`,
        htmlStringKeyValue("placeholder", placeholder),

        htmlStringKeyValue("pattern", pattern),

        htmlStringKeyValue("minlength", minLength),
        htmlStringKeyValue("maxlength", maxLength),

        htmlStringKeyValue("min", exclusiveMinimum ? exclusiveMinimum-1 : minimum),
        htmlStringKeyValue("max", exclusiveMaximum ? exclusiveMaximum-1 : maximum),

        htmlStringKeyValue("required", optional ? null : "true"),
        htmlStringKeyValue("readonly", readonly ? "true" : null),

        Object.entries(rest).map(([propKey, propValue]) => htmlStringKeyValue(propKey, propValue))
        ].join("")
      }></input>`
    ]
  })) as { [Key in keyof Validator["properties"]]: string }
)