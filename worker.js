importScripts("a.out.js");

var api;
var isInitialized = false;

Module.onRuntimeInitialized = () => {
    api = {
        version: Module.cwrap('version', 'number', []),
        create_buffer: Module.cwrap('create_buffer', 'number', ['number', 'number']),
        destroy_buffer: Module.cwrap('destroy_buffer', '', ['number']),
        encode: Module.cwrap('encode', '', ['number', 'number', 'number', 'number']),
        get_result_pointer: Module.cwrap('get_result_pointer', 'number', ''),
        get_result_size: Module.cwrap('get_result_size', 'number', ''),
        free_result: Module.cwrap('free_result', '', ['number']),
    };

    isInitialized = true;
};

onmessage = async (e) => {
    while (!isInitialized)
    {
        await new Promise(r => setTimeout(() => r(), 10));
    }

    var imageData = e.data[0];
    var fileName = e.data[1];
    var quality = e.data[2];

    const buffer = api.create_buffer(imageData.width, imageData.height);
    Module.HEAP8.set(imageData.data, buffer);

    api.encode(buffer, imageData.width, imageData.height, quality);

    const resultPointer = api.get_result_pointer();
    const resultSize = api.get_result_size();
    const resultView = new Uint8Array(Module.HEAP8.buffer, resultPointer, resultSize);
    const result = new Uint8Array(resultView);

    api.free_result(resultPointer);

    const blob = new Blob([result], { type: 'image/webp' });
    const blobURL = URL.createObjectURL(blob);

    postMessage([blobURL, fileName]);
};