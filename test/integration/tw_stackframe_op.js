const fs = require('fs');
const path = require('path');
const {test} = require('tap');
const VirtualMachine = require('../../src/virtual-machine');

const projectPath = path.join(__dirname, '..', 'fixtures', 'tw-stackframe-op.sb3');

test('util.thread.peekStackFrame().op', t => {
    const vm = new VirtualMachine();

    vm.runtime.setCompilerOptions({
        enabled: false
    });

    // Easiest way to test this is to overwrite an existing block
    vm.runtime._primitives.operator_add = function (args, util) {
        const op = util.thread.peekStackFrame().op;
        t.equal(op.id, 'c');
        t.end();

        // return value not used
        return 4;
    };

    vm.loadProject(fs.readFileSync(projectPath)).then(() => {
        vm.greenFlag();
        vm.runtime._step();
    });
});
