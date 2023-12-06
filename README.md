# formtype
Create html-only validated forms derived from [@sinclair/typebox](https://www.npmjs.com/package/@sinclair/typebox) schemas.

## How To Use
```ts
import { Type as t } from "@sinclair/typebox";
import { toFormElems } from "formtype"

const schema = t.Object({
  name: t.String({ minLength: 3, maxLength: 30 }),
  password: t.String({ minLength: 8, maxLength: 128, format: "password" })
})

const formElems = toFormElems(schema) /* {
  name: "<input type=\"text\" name=\"name\" id=\"name\" minlength=\"3\" maxlength=\"30\" required=\"true\"></input>",
  password: "<input type=\"password\" name=\"password\" id=\"password\" minlength=\"8\" maxlength=\"128\" required=\"true\"></input>"
} */
```


<details>
  <summary>Complex Example</summary>
  
  ```ts
  import { Type as t } from "@sinclair/typebox";
  import { toFormElems } from "formtype"

  const signUpFormValidator = t.Object({
    username: t.String({ minLength: 5, maxLength: 35, placeholder: "Create a unique username" }),
    age: t.Optional(t.Integer({ placeholder: "Enter your age (Optional)" })),
    password: t.String({
      format: "password", minLength: 8, maxLength: 128, placeholder: "Create a unique password",
      pattern: "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).*$",
      title: "Password must contain at least: one special character, one number, one lowercase letter, and one uppercase letter.",
    }),
    confirmPassword: t.String({
      format: "password", minLength: 8, maxLength: 128, placeholder: "Confirm your unique password",
      pattern: "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).*$",
      title: "Password must contain at least: one special character, one number, one lowercase letter, and one uppercase letter.",
    }),
    csrfToken: t.Readonly(t.String({ default: "no csrf token provided", hidden: true }))
  })

  const formElems = toFormElems(signUpFormValidator)

  const html = `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>LMFAOOOO</title>
    </head>
    <style>
      #signUpForm {
        display: flex;
        flex-direction: column;
        background-color: gray;
        gap: 11px;
        padding: 25px;
        width: 600px;
        position: absolute;
        left: 50%;
        transform: translate(-50%, 80px);
      }
      input {
        border: 0px;
        outline 0px;
        padding: 15px;
        font-size: 16px;
        border-radius: 8px;
        &::placeholder { color: #525252; }
      }
    </style>
    <body>
      <form id="signUpForm" name="signUpForm" action="/test" method="post">
        ${Object.values(formElems).join("\n")}
        <input type="submit" value="Sign Up"></input>
      </form>
    </body>
  </html>
  `

  Bun.serve({
    fetch(req) {
      return new Response(html, { headers: { "content-type": "text/html" } })
    }
  })
  ```

</details>


