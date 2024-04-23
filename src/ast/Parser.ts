import parser, { ArgumentList, ArrayDeclarationElementList, AssignmentExpression, CaseClause, CaseValueList, DefaultClause, EnumDeclaration, EnumDeclarationList, FormalParameter, FormalParameterList, FunctionDeclaration, Identifier, IncludeStatement, Initialiser, LocationRange, Program, RedimIdentifierExpression, SelectCaseClause, SourceElement, Statement, StatementList, SwitchCaseValue, SyntaxError, VariableDeclaration, VariableDeclarationList, VariableIdentifier } from "autoit3-pegjs";
import StringIdGenerator from "../misc/StringIdGenerator";
import * as fs from 'fs';
import path, {resolve} from "path";

const reservedMethodNames: Readonly<Array<string>> = ["Abs", "ACos", "AdlibRegister", "AdlibUnRegister", "Asc", "AscW", "ASin", "Assign", "ATan", "AutoItSetOption", "AutoItWinGetTitle", "AutoItWinSetTitle", "Beep", "Binary", "BinaryLen", "BinaryMid", "BinaryToString", "BitAND", "BitNOT", "BitOR", "BitRotate", "BitShift", "BitXOR", "BlockInput", "Break", "Call", "CDTray", "Ceiling", "Chr", "ChrW", "ClipGet", "ClipPut", "ConsoleRead", "ConsoleWrite", "ConsoleWriteError", "ControlClick", "ControlCommand", "ControlDisable", "ControlEnable", "ControlFocus", "ControlGetFocus", "ControlGetHandle", "ControlGetPos", "ControlGetText", "ControlHide", "ControlListView", "ControlMove", "ControlSend", "ControlSetText", "ControlShow", "ControlTreeView", "Cos", "Dec", "DirCopy", "DirCreate", "DirGetSize", "DirMove", "DirRemove", "DllCall", "DllCallAddress", "DllCallbackFree", "DllCallbackGetPtr", "DllCallbackRegister", "DllClose", "DllOpen", "DllStructCreate", "DllStructGetData", "DllStructGetPtr", "DllStructGetSize", "DllStructSetData", "DriveGetDrive", "DriveGetFileSystem", "DriveGetLabel", "DriveGetSerial", "DriveGetType", "DriveMapAdd", "DriveMapDel", "DriveMapGet", "DriveSetLabel", "DriveSpaceFree", "DriveSpaceTotal", "DriveStatus", "EnvGet", "EnvSet", "EnvUpdate", "Eval", "Execute", "Exp", "FileChangeDir", "FileClose", "FileCopy", "FileCreateNTFSLink", "FileCreateShortcut", "FileDelete", "FileExists", "FileFindFirstFile", "FileFindNextFile", "FileFlush", "FileGetAttrib", "FileGetEncoding", "FileGetLongName", "FileGetPos", "FileGetShortcut", "FileGetShortName", "FileGetSize", "FileGetTime", "FileGetVersion", "FileInstall", "FileMove", "FileOpen", "FileOpenDialog", "FileRead", "FileReadLine", "FileReadToArray", "FileRecycle", "FileRecycleEmpty", "FileSaveDialog", "FileSelectFolder", "FileSetAttrib", "FileSetEnd", "FileSetPos", "FileSetTime", "FileWrite", "FileWriteLine", "Floor", "FtpSetProxy", "FuncName", "GUICreate", "GUICtrlCreateAvi", "GUICtrlCreateButton", "GUICtrlCreateCheckbox", "GUICtrlCreateCombo", "GUICtrlCreateContextMenu", "GUICtrlCreateDate", "GUICtrlCreateDummy", "GUICtrlCreateEdit", "GUICtrlCreateGraphic", "GUICtrlCreateGroup", "GUICtrlCreateIcon", "GUICtrlCreateInput", "GUICtrlCreateLabel", "GUICtrlCreateList", "GUICtrlCreateListView", "GUICtrlCreateListViewItem", "GUICtrlCreateMenu", "GUICtrlCreateMenuItem", "GUICtrlCreateMonthCal", "GUICtrlCreateObj", "GUICtrlCreatePic", "GUICtrlCreateProgress", "GUICtrlCreateRadio", "GUICtrlCreateSlider", "GUICtrlCreateTab", "GUICtrlCreateTabItem", "GUICtrlCreateTreeView", "GUICtrlCreateTreeViewItem", "GUICtrlCreateUpdown", "GUICtrlDelete", "GUICtrlGetHandle", "GUICtrlGetState", "GUICtrlRead", "GUICtrlRecvMsg", "GUICtrlRegisterListViewSort", "GUICtrlSendMsg", "GUICtrlSendToDummy", "GUICtrlSetBkColor", "GUICtrlSetColor", "GUICtrlSetCursor", "GUICtrlSetData", "GUICtrlSetDefBkColor", "GUICtrlSetDefColor", "GUICtrlSetFont", "GUICtrlSetGraphic", "GUICtrlSetImage", "GUICtrlSetLimit", "GUICtrlSetOnEvent", "GUICtrlSetPos", "GUICtrlSetResizing", "GUICtrlSetState", "GUICtrlSetStyle", "GUICtrlSetTip", "GUIDelete", "GUIGetCursorInfo", "GUIGetMsg", "GUIGetStyle", "GUIRegisterMsg", "GUISetAccelerators", "GUISetBkColor", "GUISetCoord", "GUISetCursor", "GUISetFont", "GUISetHelp", "GUISetIcon", "GUISetOnEvent", "GUISetState", "GUISetStyle", "GUIStartGroup", "GUISwitch", "Hex", "HotKeySet", "HttpSetProxy", "HttpSetUserAgent", "HWnd", "InetClose", "InetGet", "InetGetInfo", "InetGetSize", "InetRead", "IniDelete", "IniRead", "IniReadSection", "IniReadSectionNames", "IniRenameSection", "IniWrite", "IniWriteSection", "InputBox", "Int", "IsAdmin", "IsArray", "IsBinary", "IsBool", "IsDeclared", "IsDllStruct", "IsFloat", "IsFunc", "IsHWnd", "IsInt", "IsKeyword", "IsMap", "IsNumber", "IsObj", "IsPtr", "IsString", "Log", "MapAppend", "MapExists", "MapKeys", "MapRemove", "MemGetStats", "Mod", "MouseClick", "MouseClickDrag", "MouseDown", "MouseGetCursor", "MouseGetPos", "MouseMove", "MouseUp", "MouseWheel", "MsgBox", "Number", "ObjCreate", "ObjCreateInterface", "ObjEvent", "ObjGet", "ObjName", "OnAutoItExitRegister", "OnAutoItExitUnRegister", "Opt", "Ping", "PixelChecksum", "PixelGetColor", "PixelSearch", "ProcessClose", "ProcessExists", "ProcessGetStats", "ProcessList", "ProcessSetPriority", "ProcessWait", "ProcessWaitClose", "ProgressOff", "ProgressOn", "ProgressSet", "Ptr", "Random", "RegDelete", "RegEnumKey", "RegEnumVal", "RegRead", "RegWrite", "Round", "Run", "RunAs", "RunAsWait", "RunWait", "Send", "SendKeepActive", "SetError", "SetExtended", "ShellExecute", "ShellExecuteWait", "Shutdown", "Sin", "Sleep", "SoundPlay", "SoundSetWaveVolume", "SplashImageOn", "SplashOff", "SplashTextOn", "Sqrt", "SRandom", "StatusbarGetText", "StderrRead", "StdinWrite", "StdioClose", "StdoutRead", "String", "StringAddCR", "StringCompare", "StringFormat", "StringFromASCIIArray", "StringInStr", "StringIsAlNum", "StringIsAlpha", "StringIsASCII", "StringIsDigit", "StringIsFloat", "StringIsInt", "StringIsLower", "StringIsSpace", "StringIsUpper", "StringIsXDigit", "StringLeft", "StringLen", "StringLower", "StringMid", "StringRegExp", "StringRegExpReplace", "StringReplace", "StringReverse", "StringRight", "StringSplit", "StringStripCR", "StringStripWS", "StringToASCIIArray", "StringToBinary", "StringTrimLeft", "StringTrimRight", "StringUpper", "Tan", "TCPAccept", "TCPCloseSocket", "TCPConnect", "TCPListen", "TCPNameToIP", "TCPRecv", "TCPSend", "TCPShutdown, UDPShutdown", "TCPStartup, UDPStartup", "TimerDiff", "TimerInit", "ToolTip", "TrayCreateItem", "TrayCreateMenu", "TrayGetMsg", "TrayItemDelete", "TrayItemGetHandle", "TrayItemGetState", "TrayItemGetText", "TrayItemSetOnEvent", "TrayItemSetState", "TrayItemSetText", "TraySetClick", "TraySetIcon", "TraySetOnEvent", "TraySetPauseIcon", "TraySetState", "TraySetToolTip", "TrayTip", "UBound", "UDPBind", "UDPCloseSocket", "UDPOpen", "UDPRecv", "UDPSend", "VarGetType", "WinActivate", "WinActive", "WinClose", "WinExists", "WinFlash", "WinGetCaretPos", "WinGetClassList", "WinGetClientSize", "WinGetHandle", "WinGetPos", "WinGetProcess", "WinGetState", "WinGetText", "WinGetTitle", "WinKill", "WinList", "WinMenuSelectItem", "WinMinimizeAll", "WinMinimizeAllUndo", "WinMove", "WinSetOnTop", "WinSetState", "WinSetTitle", "WinSetTrans", "WinWait", "WinWaitActive", "WinWaitClose", "WinWaitNotActive"].map(s => s.toLowerCase());
const reservedVariableNames: Readonly<Array<string>> = ["CmdLine"].map(s => s.toLowerCase());

export default class Parser {
    protected ast: Program;
    protected variableNameMap: Record<string, string>;
    protected functionNameMap: Record<string, string>;
    protected idGenerator: StringIdGenerator;
    protected includes: Array<string> = [];

    public constructor(ast: Program, variableNameMap: Record<string, string> = {}, functionNameMap: Record<string, string> = {}, idGenerator:StringIdGenerator|null = null) {
        this.ast = ast;

        if (idGenerator === null) {
            const chars = 'abcdefghijklmnopqrstuvxyz'
                .split('')
                .map(value => ({ value, sort: Math.random() })) // https://stackoverflow.com/a/46545530
                .sort((a, b) => a.sort - b.sort)
                .map(({ value, sort }) => (Math.random() < 0.5) ? value : value.toUpperCase())
                .join('');
                console.log(chars);
            this.idGenerator = new StringIdGenerator(chars);
        } else {
            this.idGenerator = idGenerator;
        }

        this.variableNameMap = variableNameMap;
        this.functionNameMap = functionNameMap;
    }

    public static parse(input: string, grammarSource: string | undefined): Parser {
        return new Parser(parser.parse(input, { grammarSource: grammarSource }));
    }

    public static isSyntaxError(e: any): e is SyntaxError {
        return e instanceof Error && 'location' in e && 'expected' in e && 'found' in e && 'format' in e;
    }

    public resolveInclude(includeStatement: IncludeStatement) {
        const includePath = resolve(path.dirname(includeStatement.location.source), includeStatement.file);
        console.log(includeStatement.file, includePath);

        const source = fs.readFileSync(includePath, { encoding: 'utf8', flag: 'r' });

        const _parser = new Parser(parser.parse(source, {grammarSource: includePath}), this.variableNameMap, this.functionNameMap, this.idGenerator);

        return _parser.toString();
    }

    public AstToString(ast: null | Program | SourceElement | AssignmentExpression | FormalParameter | Statement | RedimIdentifierExpression | DefaultClause | SelectCaseClause | CaseClause | VariableDeclaration | EnumDeclaration | Initialiser | SwitchCaseValue, preserveName: boolean = false): string {
        if (ast === null) {
            return "";
        }
        const type = ast.type;
        switch (type) {
            case "Program":
                return ast.body.map(sourceElement => this.AstToString(sourceElement)).filter(value => value !== "").join("\n");
            case "ArrayDeclaration":
                return "[" + this.AstArrayToStringArray(ast.elements).join(",") + "]";
            case "AssignmentExpression":
                return this.AstToString(ast.left) + ast.operator + this.AstToString(ast.right);
            case "BinaryExpression":
                return this.AstToString(ast.left) + ast.operator + this.AstToString(ast.right);
            case "CallExpression":
                return this.AstToString(ast.callee) + "(" + this.AstArrayToStringArray(ast.arguments).join(",") + ")";
            case "ConditionalExpression":
                return this.AstToString(ast.test) + " ? " + this.AstToString(ast.consequent) + " : " + this.AstToString(ast.alternate);
            case "ContinueCaseStatement":
                return "ContinueCase";
            case "ContinueLoopStatement":
                return "ContinueLoop";
            case "DoWhileStatement":
                return "Do\n" + this.AstArrayToStringArray(ast.body).join("\n") + "\nWhile " + this.AstToString(ast.test);
            case "EmptyStatement":
                return "";
            case "EnumDeclaration":
                return (ast.scope === null ? "" : ast.scope + " ") + (ast.constant ? "Const " : "") + "Enum Step " + ast.stepoperator + ast.stepval + " " + this.AstArrayToStringArray(ast.declarations);
            case "ExitLoopStatement":
                return "ExitLoop " + this.AstToString(ast.level);
            case "ExitStatement":
                return "Exit " + this.AstToString(ast.argument);
            case "ExpressionStatement":
                return this.AstToString(ast.expression);
            case "ForInStatement":
                return "For " + this.AstToString(ast.left) + " In " + this.AstToString(ast.right) + "\n" + this.AstArrayToStringArray(ast.body).join("\n") + "\nNext";
            case "ForStatement":
                return "For " + this.AstToString(ast.id) + "=" + this.AstToString(ast.init) + " To " + this.AstToString(ast.test) + (ast.update === null ? "" : " Step " + this.AstToString(ast.update)) + "\n" + this.AstArrayToStringArray(ast.body).join("\n") + "\nNext";
            case "FunctionDeclaration":
                return "Func " + this.getShortName(ast.id) + "(" + this.AstArrayToStringArray(ast.params).join(",") + ")\n" + this.AstArrayToStringArray(ast.body).join("\n") + "\nEndFunc";
            case "Identifier":
                return preserveName ? ast.name : this.getShortName(ast);
            case "IfStatement":
                if ('alternate' in ast) {
                    // multi-line if statement
                    return "If " + this.AstToString(ast.test) + " Then\n" + (Array.isArray(ast.consequent) ? this.AstArrayToStringArray(ast.consequent).join("\n") : this.AstToString(ast.consequent)) + "\nEndIf";
                }

                // single line if statement
                return "If " + this.AstToString(ast.test) + " Then " + this.AstToString(ast.consequent);
            case "IncludeOnceStatement":
                return "#include-once";
            case "IncludeStatement":
                return this.resolveInclude(ast);
                //return `#include ${ast.library?'<':'"'}${ast.file}${ast.library?'>':'"'}`;
            case "Keyword":
                return ast.value;
            case "Literal":
                return JSON.stringify(ast.value);
            case "LogicalExpression":
                return this.AstToString(ast.left) + " " + ast.operator + " " + this.AstToString(ast.right);
            case "Macro":
                return ast.value;
            case "MemberExpression":
                if (ast.computed) { // array index accessor
                    return this.AstToString(ast.object) + "[" + this.AstToString(ast.property) + "]";
                } else { // object property accessor
                    return this.AstToString(ast.object) + "." + this.AstToString(ast.property, true);
                }
            case "MultiLineComment":
                return "";
            case "NotExpression":
                return "Not " + this.AstToString(ast.value);
            case "Parameter":
                return (ast.const ? "Const " : "") + (ast.byref ? "ByRef " : "") + this.AstToString(ast.id) + (ast.init === null ? "" : "=" + this.AstToString(ast.init));
            case "PreProcStatement":
                return "#" + ast.body;
            case "RedimExpression":
                return "ReDim " + this.AstArrayToStringArray(ast.declarations).join(",");
            case "RedimIdentifierExpression":
                throw new Error("Parser node not implemented correct, yet.");//FIXME
            case "ReturnStatement":
                return "Return " + this.AstToString(ast.value);
            case "SelectCase":
                return "Case " + this.AstToString(ast.tests) + "\n" + this.AstArrayToStringArray(ast.consequent).join("\n");
            case "SelectStatement":
                return "Select\n" + this.AstArrayToStringArray(ast.cases).join("\n") + "\nEndSelect";
            case "SingleLineComment":
                return ""
            case "SwitchCase":
                return "Case " + this.AstArrayToStringArray(ast.tests).join(",") + "\n" + this.AstArrayToStringArray(ast.consequent).join("\n");
            case "SwitchCaseRange":
                return this.AstToString(ast.from) + " To " + this.AstToString(ast.to);
            case "SwitchStatement":
                return "Switch " + this.AstToString(ast.discriminant) + "\n" + this.AstArrayToStringArray(ast.cases).join("\n") + "\nEndSwitch";
            case "UnaryExpression":
                return ast.operator + this.AstToString(ast.argument);
            case "VariableDeclaration":
                return (ast.scope === null ? "" : ast.scope + " ") + (ast.constant ? "Const " : "") + this.AstArrayToStringArray(ast.declarations);
            case "VariableDeclarator":
                const left = this.AstToString(ast.id);
                if (ast.init === null) {
                    return left;
                }
                return left + "=" + this.AstToString(ast.init);
            case "VariableIdentifier":
                return `$${this.getShortName(ast)}`;
            case "WhileStatement":
                return "While " + ast.test + "\n" + this.AstArrayToStringArray(ast.body).join("\n") + "\nWEnd";
            case "WithStatement":
                return "With " + this.AstToString(ast.object) + "\n" + this.AstArrayToStringArray(ast.body).join("\n") + "\nEndWith";
            default:
                (function (type: never): never {
                    throw new Error(`AST type not supported: "${type}"`);
                })(type);
        }
    }

    public AstArrayToStringArray(astArray: StatementList | FormalParameterList | RedimIdentifierExpression[] | (DefaultClause | SelectCaseClause)[] | (DefaultClause | CaseClause)[] | VariableDeclarationList | EnumDeclarationList | ArgumentList | CaseValueList | ArrayDeclarationElementList | null): string[] {
        const result: string[] = [];
        if (astArray === null) {
            return [];
        }
        for (const ast of astArray) {
            result.push(this.AstToString(ast));
        }
        return result.filter(value => value !== '');
    }

    public getShortName(node: VariableIdentifier | Identifier): string {
        let map: Record<string, string>;
        const type = node.type;
        switch (type) {
            case 'Identifier':
                if (reservedMethodNames.includes(node.name.toLowerCase())) {
                    return node.name.toLowerCase();
                }
                map = this.functionNameMap;
                break;
            case 'VariableIdentifier':
                map = this.variableNameMap;
                break;
            default:
                throw new Error(`Unexpected type: ${type satisfies never}`);
        }

        return map[node.name] ??= this.idGenerator.next();
    }

    public toString(): string {
        return this.AstToString(this.ast);
    }
}
