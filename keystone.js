import {FileSystemAdapter} from 'obsidian'

const fs = require('fs');
module.exports = function (app) {
    var module = {};
    
    dat = fs.readFileSync(getAbsolutePath('lib/keystone.min.js'), 'utf-8');
    eval(dat);

    function getAbsolutePath(fileName) {
        let basePath;
        let relativePath;
        // base path
        if (this.app.vault.adapter instanceof FileSystemAdapter) {
            basePath = this.app.vault.adapter.getBasePath();
        } else {
            throw new Error('Cannot determine base path.');
        }
        // relative path
        relativePath = `${this.app.vault.configDir}/plugins/obsidian-keystone/${fileName}`;
        // absolute path
        return `${basePath}/${relativePath}`;
    }

    module.assemble = (asm, arch, mode) =>  {
        var a = new ks.Keystone(ks.ARCH_X86, ks.MODE_64);
        a.option(ks.OPT_SYNTAX, ks.OPT_SYNTAX_INTEL);

        var engine = new ks.Keystone(arch, mode);
        var result = engine.asm(asm);
        engine.delete();
        return {
            "asm" : asm, 
            "hex": module.bytesToHex(result)
        }
    }

    module.bytesToHex = (bytes) => {
        for (var hex = [], i = 0; i < bytes.length; i++) {
            hex.push((bytes[i] >>> 4).toString(16));
            hex.push((bytes[i] & 0xF).toString(16));
        }
        return hex.join("").replace(/(.{2})/g,"$1 ");
    }
    module.ks = ks;
    return module;
};

//module.exports.ks = ks;