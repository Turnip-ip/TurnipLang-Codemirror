import { TURNIPLang } from "../dist/index.js";
import { fileTests } from "@lezer/generator/dist/test";

import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
let caseDir = path.dirname(fileURLToPath(import.meta.url));

// let tree = TURNIPLang.parser.parse(`START | b -> (b,R), START | _ -> (_,L), q`)
// console.log(tree.toString())

for (let file of fs.readdirSync(caseDir)) {
  if (!/\.txt$/.test(file)) continue;

  let name = /^[^\.]*/.exec(file)[0];
  describe(name, () => {
    for (let { name, run } of fileTests(
      fs.readFileSync(path.join(caseDir, file), "utf8"),
      file
    ))
      it(name, () => run(TURNIPLang.parser));
  });
}
