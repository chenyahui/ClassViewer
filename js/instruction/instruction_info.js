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
    // 
    18: ["ldc", 1],
    68: ["fstore_1"],
    35: ["fload_1"],
    139: ["f2i"],
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