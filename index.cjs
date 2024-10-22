'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var lr = require('@lezer/lr');
var language = require('@codemirror/language');
var highlight = require('@lezer/highlight');
var common = require('@lezer/common');

// This file was generated by lezer-generator. You probably shouldn't edit it.
const parser = lr.LRParser.deserialize({
  version: 14,
  states: "#rQYQPOOO_QPO'#C_OOQO'#Ce'#CeQYQPOOOdQQO'#CaOOQO'#Cf'#CfOrQPO,58yOOQO-E6c-E6cOOQO'#Cc'#CcO}QPO'#CbO!SQPO,58{OOQO-E6d-E6dO!XQPO,58|O!^QPO1G.gOdQQO1G.hOOQO7+$R7+$RO!cQPO7+$SO!hQQO<<GnOOQO'#Cd'#CdO!pQPOAN=YOOQOG22tG22t",
  stateData: "!u~O]OSPOS~OSPO~O^SO~O`WOaWObWOcWO~O^SOSRaZRa~Od[O~Of]O~Oe^O~OS_O~OfaO~OgbOhbO~O_dO~O",
  goto: "|ZPPP[P`dgmpvTQORTTPURYSQXSR`^RcaQRORVRQUPRZU",
  nodeNames: "⚠ Comment File State Sname State_rule Tape_action Tape_symbol Head_move",
  maxTerm: 24,
  skippedNodes: [0,1],
  repeatNodeCount: 2,
  tokenData: "&}~RiXY!pYZ!p]^!ppq!pst#Rxy#jyz#o|}#t}!O#y!Q!R$U!R!S$Z!c!n$`!n!o$q!o!t$`!t!u%U!u!}$`#R#S%i#T#U$`#U#V%|#V#o$`#p#q&a$Jb'&l&f;(b;(c&k;(c;(d&q;(d;(e&w~!uS]~XY!pYZ!p]^!ppq!p~#WSP~OY#RZ;'S#R;'S;=`#d<%lO#R~#gP;=`<%l#R~#oOe~~#tO_~~#yOf~~#|P!`!a$P~$UOd~~$ZO`~~$`Oa~P$eSSP!R![$`!c!}$`#R#S$`#T#o$`R$xSgQSP!R![$`!c!}$`#R#S$`#T#o$`R%]ShQSP!R![$`!c!}$`#R#S$`#T#o$`R%pSbQSP!R![$`!c!}$`#R#S$`#T#o$`R&TScQSP!R![$`!c!}$`#R#S$`#T#o$`~&fO^~P&kOSPP&nP;=d<%l&fP&tP;=`<%l&fP&zP;=`;My&f",
  tokenizers: [0, 1],
  topRules: {"File":[0,2]},
  tokenPrec: 0
});

const TURNIPLang = language.LRLanguage.define({
    parser: parser.configure({
        props: [
            language.indentNodeProp.add({
                Application: language.delimitedIndent({ closing: ")", align: false }),
            }),
            language.foldNodeProp.add({
                Application: language.foldInside,
            }),
            highlight.styleTags({
                Tape_symbol: highlight.tags.literal,
                Head_move: highlight.tags.typeName,
                //Tape_action: t.
                //State_rule: t.
                //State: t.
                Sname: highlight.tags.variableName,
                Comment: highlight.tags.comment,
                "->": highlight.tags.operator,
                "|": highlight.tags.operator,
                "( )": highlight.tags.paren,
                ",": highlight.tags.operator,
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
function getStateNames(tree, doc, excludedFrom) {
    const names = new Set();
    tree.cursor(common.IterMode.IncludeAnonymous).iterate((node) => {
        if (node.type.is("Sname") && node.from !== excludedFrom) {
            names.add(doc.sliceString(node.from, node.to));
        }
    });
    let completions = [
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
function turnipCompletionFor(context) {
    let { state, pos } = context;
    let tree = language.syntaxTree(state).resolveInner(pos, -1);
    //let around = tree.resolve(pos)
    // tree.from correspond to the start of the current node
    const stateNames = getStateNames(language.syntaxTree(state), state.doc, tree.from);
    // TODO: we may want to propose Sname autocomplete even when a Sname is not started, but only expected
    if (tree.name == "Sname") {
        return {
            from: tree.from,
            options: stateNames,
        };
    }
    // TODO: we may want to autocomplete complete states
}
const turnipCompletion = TURNIPLang.data.of({
    autocomplete: turnipCompletionFor,
});
function turnip_lang() {
    return new language.LanguageSupport(TURNIPLang, [turnipCompletion]);
}

exports.TURNIPLang = TURNIPLang;
exports.turnipCompletion = turnipCompletion;
exports.turnip_lang = turnip_lang;
