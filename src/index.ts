import { parser } from "./syntax.grammar";
import {
  LRLanguage,
  LanguageSupport,
  indentNodeProp,
  foldNodeProp,
  foldInside,
  delimitedIndent,
  syntaxTree,
} from "@codemirror/language";
import { styleTags, tags as t } from "@lezer/highlight";
import { Completion, CompletionContext } from "@codemirror/autocomplete";
import { IterMode, Tree } from "@lezer/common";
import { Text } from "@codemirror/state";

export const TURNIPLang = LRLanguage.define({
  parser: parser.configure({
    props: [
      indentNodeProp.add({
        Application: delimitedIndent({ closing: ")", align: false }),
      }),
      foldNodeProp.add({
        Application: foldInside,
      }),
      styleTags({
        Tape_symbol: t.literal,
        Head_move: t.typeName,
        //Tape_action: t.
        //State_rule: t.
        //State: t.
        Sname: t.variableName,
        Comment: t.comment,
        "->": t.operator,
        "|": t.operator,
        "( )": t.paren,
        ",": t.operator,
      }),
    ],
  }),
  languageData: {
    commentTokens: { line: "#" },
  },
});

// TODO: we may want use cache
// See https://github.com/codemirror/lang-python/blob/main/src/complete.ts#L61
/**
 * Construct a completions list containing all defined states.
 * @param tree
 * @param doc
 * @param excludedFrom position of the current node, we don't want to include the partially written state in the completion list
 * @returns
 */
function getStateNames(tree: Tree, doc: Text, excludedFrom: number) {
  const names = new Set<string>();

  tree.cursor(IterMode.IncludeAnonymous).iterate((node) => {
    if (node.type.is("Sname") && node.from !== excludedFrom) {
      names.add(doc.sliceString(node.from, node.to));
    }
  });

  let completions: Completion[] = [
    { label: "START", type: "constant" },
    { label: "END", type: "constant" },
  ];
  for (const name of names) {
    if (name !== "START" && name !== "END") {
      completions.push({ label: name, type: "variable" });
    }
  }

  return completions;
}

function turnipCompletionFor(context: CompletionContext) {
  let { state, pos } = context;
  let tree = syntaxTree(state).resolveInner(pos, -1);
  //let around = tree.resolve(pos)

  // tree.from correspond to the start of the current node
  const stateNames = getStateNames(syntaxTree(state), state.doc, tree.from);

  // TODO: we may want to propose Sname autocomplete even when a Sname is not started, but only expected
  if (tree.name == "Sname") {
    return {
      from: tree.from,
      options: stateNames,
    };
  }
  // TODO: we may want to autocomplete complete states
}

export const turnipCompletion = TURNIPLang.data.of({
  autocomplete: turnipCompletionFor,
});

export function turnip_lang() {
  return new LanguageSupport(TURNIPLang, [turnipCompletion]);
}
