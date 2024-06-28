module.exports = function(s){
    s.addCloudUploader = function(opt){
        s.loadGroupAppExtender(opt.loadGroupAppExtender)
        s.unloadGroupAppExtender(opt.unloadGroupAppExtender)
        s.insertCompletedVideoExtender(opt.insertCompletedVideoExtender)
        s.deleteVideoFromCloudExtensions[opt.name] = opt.deleteVideoFromCloudExtensions
        s.cloudDiskUseStartupExtensions[opt.name] = opt.cloudDiskUseStartupExtensions
        if(opt.onInsertTimelapseFrame)s.onInsertTimelapseFrame(opt.onInsertTimelapseFrame)
        if(opt.onDeleteTimelapseFrameFromCloud)s.onDeleteTimelapseFrameFromCloudExtensions[opt.name] = opt.onDeleteTimelapseFrameFromCloud
        s.beforeAccountSave(opt.beforeAccountSave)
        s.onAccountSave(opt.onAccountSave)
        s.cloudDisksLoaded.push(opt.name)
        if(opt.onGetVideoData)s.cloudDiskUseOnGetVideoDataExtensions[opt.name] = opt.onGetVideoData
    }
    s.addSimpleUploader = function(opt){
        s.loadGroupAppExtender(opt.loadGroupAppExtender)
        s.unloadGroupAppExtender(opt.unloadGroupAppExtender)
        s.insertCompletedVideoExtender(opt.insertCompletedVideoExtender)
        if(opt.onInsertTimelapseFrame)s.onInsertTimelapseFrame(opt.onInsertTimelapseFrame)
        s.beforeAccountSave(opt.beforeAccountSave)
        s.onAccountSave(opt.onAccountSave)
        s.onMonitorSave(opt.onMonitorSave)
    }
}
