const {test} = require('tap');
const VirtualMachine = require('../../src/virtual-machine');
const RenderedTarget = require('../../src/sprites/rendered-target');
const Sprite = require('../../src/sprites/sprite');

test('Serializes custom extensions', t => {
    t.plan(6);

    const vm = new VirtualMachine();

    // Trick the extension manager into thinking a couple extensions are loaded.
    vm.extensionManager.workerURLs[0] = 'https://example.com/test1.js';
    vm.extensionManager.workerURLs[1] = 'https://example.com/test2.js';
    // First number in the service names corresponds to index in workerURLs
    vm.extensionManager._loadedExtensions.set('test1', 'test.0.0');
    vm.extensionManager._loadedExtensions.set('test2', 'test.1.0');

    const targetUsingBlock = new RenderedTarget(new Sprite(null, vm.runtime), vm.runtime);
    vm.runtime.addTarget(targetUsingBlock);
    targetUsingBlock.blocks.createBlock({
        id: 'a',
        opcode: 'test1_something'
    });

    const targetNotUsingBlock = new RenderedTarget(new Sprite(null, vm.runtime), vm.runtime);
    vm.runtime.addTarget(targetNotUsingBlock);

    // test2 isn't used, so it shouldn't be included in the JSON

    const serializedProject = JSON.parse(vm.toJSON());
    t.same(serializedProject.extensions, ['test1'], 'save extension IDs for project');
    t.same(serializedProject.extensionURLs, {
        test1: 'https://example.com/test1.js'
    }, 'save extension URLs for project');

    const serializedTargetWithBlock = JSON.parse(vm.toJSON(targetUsingBlock.id));
    t.same(serializedTargetWithBlock.extensions, ['test1'], 'save extension IDs for sprite');
    t.same(serializedTargetWithBlock.extensionURLs, {
        test1: 'https://example.com/test1.js'
    }, 'save extension URLs for sprite');

    // other sprite uses no extensions, so don't want extension stuff in the JSON
    const serializedTargetWithoutBlock = JSON.parse(vm.toJSON(targetNotUsingBlock.id));
    t.notOk('extensions' in serializedTargetWithoutBlock, 'dont save extension IDs for empty sprite');
    t.notOk('extensionURLs' in serializedTargetWithoutBlock, 'dont save extension URLs for empty sprite');

    t.end();
});
