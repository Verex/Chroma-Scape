class _FileLoader_
{
    constructor()
    {
        this.defaultTag = "FILE";
    }

    loadFile(srcFile, tag = this.defaultTag) {
        var data = null;
        $.ajax({
            url: srcFile,
            async: false,
            success: (resultData, textStatus, xhr) => { 
                console.log("[" + tag + "]: Loaded: " + srcFile + " status: (" + xhr.status + ")" + textStatus);
                data = resultData; 
            },
            error: (msg) => { console.error("You don screwed up! ");} 
        });
        return data;
    }
}

var Files = (function(){
    var instance;
    return {
        getInstance: function() {
            if (null == instance) {
                instance = new _FileLoader_();
            }
            return instance;
        }
   };
})();
