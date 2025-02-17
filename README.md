# CodeMirror 6 language package for TurnipLang

## Local development

After editing the grammar:
```bash
npm run prepare
```

After modifying something:
```bash
npm link
```

You can then use `npm link codemirror-lang-turnip-lang` in the project where you want to install your local version of this module.

## Tests

To see the tree constructed by the parser, you can use:
```js
let tree = TURNIPLang.parser.parse(`START | b -> (b,R), START | _ -> (_,L), q`)
console.log(tree.toString())
```