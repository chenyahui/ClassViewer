const Instructions = {
    50: ["aaload"],
    83: ["aastore"],
    1: ["aconst_null"],
    25: ["aload"],
    42: ["aload_0"],
    43: ["aload_1"],
    44: ["aload_2"],
    45: ["aload_3"],
    189: ["anewarray", 2],
    176: ["areturn"],
    190: ["arraylength"],
    58: ["astore", 1],
    75: ["astore_0"],
    76: ["astore_1"],
    77: ["astore_2"],
    78: ["astore_3"],
    191: ["athrow"],
    51: ["baload"],
    84: ["bastore"],
    16: ["bipush"],
    52: ['caload'],
    85: ['castore'],
    192: ['checkcast', 2],
    144: ['d2f'],
    142: ['d2i'],
    143: ['d2l'],
    99: ['dadd'],
    49: ['daload'],
    82: ['dastore'],
    152: ['dcmpg'],
    151: ['dcmpl'],
    14: ['dconst_0'],
    15: ['dconst_1'],
    111: ['ddiv'],
    24: ['dload', 1],
    38: ['dload_0'],
    39: ['dload_1'],
    40: ['dload_2'],
    41: ['dload_3'],
    107: ['dmul'],
    119: ['dneg'],
    115: ['drem'],
    175: ['dreturn'],
    57: ['dstore', 1],
    71: ['dstore_0'],
    72: ['dstore_1'],
    73: ['dstore_2'],
    74: ['dstore_3'],
    103: ['dsub'],
    89: ['dup'],
    90: ['dup_x1'],
    91: ['dup_x2'],
    92: ['dup2'],
    93: ['dup2_x1'],
    94: ['dup2_x2'],
    141: ['f2d'],
    139: ["f2i"],
    140: ['f2l'],
    98: ['fadd'],
    48: ['faload'],
    81: ['fastore'],
    150: ['fcmpg'],
    149: ['fcmpl'],
    11: ['fconst_0'],
    12: ['fconst_1'],
    13: ['fconst_2'],
    110: ['fdiv'],
    23: ['fload', 1],
    34: ["fload_0"],
    35: ["fload_1"],
    36: ["fload_2"],
    37: ["fload_3"],
    106: ['fmul'],
    118: ['fneg'],
    114: ['frem'],
    174: ['freturn'],
    56: ["fstore",1],
    67: ["fstore_0"],
    68: ["fstore_1"],
    69: ["fstore_2"],
    70: ["fstore_3"],
    102: ['fsub'],
    180: ['getfield', 2],
    178: ['getstatic', 2],
    167: ['goto', 2],
    200: ['goto_w', 4],
    // 
    18: ["ldc", 1],
    61: ["istore_2"],
    177: ["return"],
    183: ["invokespecial", 2],
}


function interpret_code(code) {
    let reader = new CodeReader(code)

    let result = []
    while (true) {
        let tag = reader.read(1)
        if (tag == false) {
            break;
        }
        let inst = Instructions[tag]
        if (inst == undefined) {
            log("找不到指令！！")
            break;
        }
        result.push(inst[0])
        for (let i = 1; i < inst.length; i++) {
            reader.read(inst[i])
        }
    }

    return result
}