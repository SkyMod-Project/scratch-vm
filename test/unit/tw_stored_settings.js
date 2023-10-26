const tap = require('tap');
const path = require('path');
const readFileToBuffer = require('../fixtures/readProjectFile').readFileToBuffer;
const makeTestStorage = require('../fixtures/make-test-storage');
const VirtualMachine = require('../../src/virtual-machine');

const test = tap.test;

const makeVM = () => {
    const vm = new VirtualMachine();
    vm.attachStorage(makeTestStorage());
    return vm;
};

for (const file of ['empty-comment.sb3', 'no-comment.sb3']) {
    test(`serializes and deserializes settings (${file})`, t => {
        const project = readFileToBuffer(path.resolve(__dirname, `../fixtures/tw-stored-settings/${file}`));
        const vm = makeVM();
        vm.loadProject(project).then(() => {
            vm.setFramerate(45);
            vm.setTurboMode(true);
            vm.setInterpolation(true);
            vm.setRuntimeOptions({
                maxClones: Infinity,
                miscLimits: false,
                fencing: false
            });
            vm.setStageSize(100, 101);
            vm.storeProjectOptions();

            const newVM = makeVM();
            newVM.loadProject(vm.toJSON())
                .then(() => {
                    t.equal(newVM.runtime.framerate, vm.runtime.framerate);
                    t.equal(newVM.runtime.turboMode, vm.runtime.turboMode);
                    t.same(newVM.runtime.runtimeOptions, vm.runtime.runtimeOptions);
                    t.equal(newVM.runtime.interpolationEnabled, vm.runtime.interpolationEnabled);
                    t.equal(newVM.runtime.stageWidth, vm.runtime.stageWidth);
                    t.equal(newVM.runtime.stageHeight, vm.runtime.stageHeight);
                    t.end();
                });
        });
    });
}

test('Reuses comment if it already exists', t => {
    const project = readFileToBuffer(path.resolve(__dirname, `../fixtures/tw-stored-settings/empty-comment.sb3`));
    const vm = makeVM();
    vm.loadProject(project)
        .then(() => {
            t.equal(Object.keys(vm.runtime.getTargetForStage().comments).length, 1);
            vm.setFramerate(99);
            vm.storeProjectOptions();
            t.equal(Object.keys(vm.runtime.getTargetForStage().comments).length, 1);
            t.end();
        });
});

test('Storing settings emits workspace update only when stage open', t => {
    const project = readFileToBuffer(path.resolve(__dirname, `../fixtures/tw-stored-settings/sprite.sb3`));
    const vm = makeVM();
    vm.loadProject(project)
        .then(() => {
            let didFireUpdate = false;
            vm.on('workspaceUpdate', () => {
                didFireUpdate = true;
            });
            vm.storeProjectOptions();
            t.equal(didFireUpdate, false);
            vm.setEditingTarget(vm.runtime.getTargetForStage().id);
            vm.storeProjectOptions();
            t.equal(didFireUpdate, true);
            t.end();
        });
});

test('Storing settings emits project changed', t => {
    const project = readFileToBuffer(path.resolve(__dirname, `../fixtures/tw-stored-settings/sprite.sb3`));
    const vm = makeVM();
    vm.loadProject(project)
        .then(() => {
            t.plan(1);
            vm.on('PROJECT_CHANGED', () => {
                t.pass();
            });
            vm.storeProjectOptions();
            t.end();
        });
});

test('Stored turbo mode emits event on VM', async t => {
    const vm = makeVM();
    const project = readFileToBuffer(path.resolve(__dirname, '../fixtures/tw-stored-settings/turbo-mode.sb3'));
    t.plan(1);
    vm.on('TURBO_MODE_ON', () => {
        t.pass('emitted TURBO_MODE_ON');
    });
    await vm.loadProject(project);
    t.end();
});
