'use strict';
const http = require('http');
const querystring = require('querystring');
const jsdom = require('jsdom');
const debug = require('debug')('mpc-hc-ipc');


function toBoolean(v) {
        return v === "1";
}

function toSize(v) {
        const units = ['', 'k', 'M', 'G', 'T', 'P', 'E'];
        const [amount, unit] = v.split(' ', 2);
        let size = parseFloat(amount);
        return size * Math.pow(1000, units.indexOf(unit[0] == 'B' ? '' : unit[0]));
}


const endpoints = {
        command: '/command.html',
        variables: '/variables.html',
        browser: '/browser.html'
};

const variables = {
        'file': null, 'filepath': null, 'filedir': null,
        'state': Number, 'statestring': null,
        'position': Number, 'positionstring': null,
        'duration': Number, 'durationstring': null,
        'volumelevel': Number,
        'muted': toBoolean,
        'playbackrate': Number,
        'size': toSize,
        'reloadtime': Number,
        'version': null
};

const commands = {
        setVolume: -2,
        seek: -1,
        quickOpenFile: 969,
        openFile: 800,
        openMedia: 801,
        openDevice: 802,
        reopenFile: 976,
        moveToRecycleBin: 24044,
        saveCopy: 805,
        saveImage: 806,
        saveImageAuto: 807,
        saveThumbnails: 808,
        loadSubtitle: 809,
        saveSubtitle: 810,
        close: 804,
        openProperties: 814,
        exit: 816,
        play: 887,
        pause: 888,
        togglePause: 889,
        stop: 890,
        stepFrame: 891,
        stepFrameBack: 892,
        goTo: 893,
        decreaseRate: 894,
        increaseRate: 895,
        resetRate: 896,
        increaseAudioDelay: 905,
        decreaseAudioDelay: 906,
        jumpBackwardKeyFrame: 898,
        jumpForwardKeyFrame: 899,
        jumpBackwardSmall: 899,
        jumpForwardSmall: 900,
        jumpBackwardMedium: 901,
        jumpForwardMedium: 902,
        jumpBackwardLarge: 903,
        jumpForwardLarge: 904,
        jumpToBeginning: 996,
        previousFile: 919,
        nextFile: 920,
        previous: 921,
        next: 922,
        scanTuner: 974,
        quickAddFavorite: 975,
        toggleCaptionMenu: 817,
        toggleSeeker: 818,
        toggleControls: 819,
        toggleInformation: 820,
        toggleStatistics: 821,
        toggleStatus: 822,
        toggleSubresyncBar: 823,
        togglePlaylistBar: 824,
        toggleCaptureBar: 825,
        toggleDebugShaders: 826,
        toggleNavigationBar: 33415,
        setViewMinimal: 827,
        setViewCompact: 828,
        setViewNormal: 829,
        fullscreen: 830,
        fullscreenWithoutResolutionChange: 831,
        zoomTo50: 832,
        zoomTo100: 833,
        zoomTo200: 834,
        zoomToAutoFit: 968,
        zoomToAutoFitLargerOnly: 4900,
        nextARPreset: 859,
        videoFrameHalf: 835,
        videoFrameNormal: 836,
        videoFrameDouble: 837,
        videoFrameStretch: 838,
        videoFrameInside: 839,
        videoFrameOutside: 840,
        videoFrameZoom1: 841,
        videoFrameZoom2: 842,
        setAlwaysOnTop: 884,
        resetPnS: 861,
        increasePnSSize: 862,
        decreasePnSSize: 863,
        increasePnSWidth: 864,
        decreasePnSWidth: 865,
        increasePnSHeight: 866,
        decreasePnSHeight: 867,
        setPnSLeft: 868,
        setPnSRight: 869,
        setPnSUp: 870,
        setPnSDown: 871,
        setPnSUpLeft: 872,
        setPnSUpRight: 873,
        setPnSDownLeft: 874,
        setPnSDownRight: 875,
        setPnSCenter: 876,
        rotatePnSXPlus: 877,
        rotatePnSXMinus: 878,
        rotatePnSYPlus: 879,
        rotatePnSYMinus: 880,
        rotatePnSZPlus: 881,
        rotatePnSZMinus: 882,
        increaseVolume: 907,
        decreaseVolume: 908,
        toggleMute: 909,
        increaseVolumeBoost: 970,
        decreaseVolumeBoost: 971,
        minimizeVolumeBoost: 972,
        maximizeVolumeBoost: 973,
        toggleCustomChannelMapping: 993,
        toggleNormalization: 994,
        toggleRegainVolume: 995,
        increaseBrightness: 984,
        decreaseBrightness: 985,
        increaseContrast: 986,
        decreaseContrast: 987,
        increaseHue: 988,
        decreaseHue: 989,
        increaseSaturation: 990,
        decreaseSaturation: 991,
        resetColorSettings: 992,
        goToDVDTitleMenu: 923,
        goToDVDRootMenu: 924,
        goToDVDSubtitleMenu: 925,
        goToDVDAudioMenu: 926,
        goToDVDAngleMenu: 927,
        goToDVDChapterMenu: 928,
        sendDVDMenuLeft: 929,
        sendDVDMenuRight: 930,
        sendDVDMenuUp: 931,
        sendDVDMenuDown: 932,
        sendDVDMenuActivate: 933,
        sendDVDMenuBack: 934,
        sendDVDMenuLeave: 935,
        bossKey: 944,
        showShortPlayerMenu: 949,
        showLongPlayerMenu: 950,
        showFiltersMenu: 951,
        showOptions: 815,
        nextAudioTrack: 952,
        previousAudioTrack: 953,
        nextSubtitleTrack: 954,
        previousSubtitleTrack: 955,
        toggleSubtitles: 956,
        reloadSubtitles: 2302,
        downloadSubtitles: 812,
        nextAudioOGMTrack: 957,
        previousAudioOGMTrack: 958,
        nextSubtitleOGMTrack: 959,
        previousSubtitleOGMTrack: 960,
        nextAngle: 961,
        previousAngle: 962,
        nextAudioDVDTrack: 963,
        previousAudioDVDTrack: 964,
        nextSubtitleDVDTrack: 965,
        previousSubtitleDVDTrack: 966,
        toggleSubtitlesDVD: 967,
        doTearingTest: 32769,
        showRemainingTime: 32778,
        nextShaderPreset: 57382,
        previousShaderPreste: 57384,
        toggleDirect3DFullscreen: 32779,
        goToNextSubtitle: 32780,
        goToPreviousSubtitle: 32781,
        shiftSubtitleLeft: 32782,
        shiftSubtitleRight: 32783,
        showDisplayStatistics: 32784,
        resetDisplayStatistics: 33405,
        setVSync: 33243,
        enableFrameTimeCorrection: 33265,
        setAccurateVSync: 33260,
        decreaseVSyncOffset: 33246,
        increaseVSyncOffset: 33247,
        increaseSubtitleDelay: 24000,
        decreaseSubtitleDelay: 24001,
        exitAfterPlayback: 912,
        standByAfterPlayback: 913,
        hibernateAfterPlayback: 914,
        shutdownAfterPlayback: 915,
        logOffAfterPlayback: 916,
        lockAfterPlayback: 917,
        turnOffMonitorAfterPlayback: 918,
        playNextFileAfterPlayback: 947,
        toggleEDLWindow: 846,
        setEDLIn: 847,
        setEDLOut: 848,
        addEDLClip: 849,
        saveEDL: 860
};


class MediaPlayerClassicClient {

        constructor(opts) {
                this.opts = opts;
                this.request_id = 1;
                this.handlers = {};
                this.commands = {};
                
                return new Proxy(this, {
                        get: (target, property, receiver) => {
                                if (property in target) {
                                        return target[property];
                                } else if (property in commands) {
                                        return (...args) => target.command(commands[property], ...args);
                                } else if (property.startsWith('get') && property !== 'get') {
                                        property = property.substr(3).toLowerCase();
                                        return () => target.get(property);
                                }
                        }
                });
        }

        on(event, handler) {
                this.handlers[event] = this.handlers[event] || [];
                this.handlers[event].push(handler);
                return handler;
        }

        off(event, handler) {
                this.handlers[event] = this.handlers[event].filter(h => h !== handler);
        }

        emit(event, ...args) {
                if (!(event in this.handlers))
                        return;
                for (var h of this.handlers[event]) {
                        h(...args);
                }
        }
        
        

        doRequest(opts, pre, post) {
                return new Promise((resolve, reject) => {
                        if (pre && pre(resolve, reject)) { return; }
                        const params = Object.assign(opts, this.opts);
                        const req = http.request(params, res => {
                                let data = '';
                                res.setEncoding('utf8');
                                res.on('data', chunk => {
                                        data += chunk;
                                });
                                res.on('end', () => {
                                        if (res.statusCode < 200 || res.statusCode >= 400) {
                                                reject(data);
                                        } else {
                                                resolve(data);
                                        }
                                });
                        });
                        req.on('error', e => reject(e.message));
                        if (post) post(req, resolve, reject);
                        req.end();
                });
        }

        command(command, args) {
                args = args || {};
                args.wm_command = command;
                const formData = querystring.stringify(args);
                return this.doRequest({
                        path: endpoints.command,
                        method: 'POST',
                        headers: {
                                'Content-Length': Buffer.byteLength(formData),
                                'Content-Type': 'application/x-www-form-urlencoded'
                        }
                }, null, (req, resolve, reject) => { req.write(formData); });
        }
        
        get(variable) {
                return this.doRequest({
                        path: endpoints.variables,
                }, (resolv, reject) => {
                        if (variable !== undefined && !(variable in variables)) {
                                reject('Unknown variable: ' + variable);
                                return true;
                        }
                }).then((body) => {
                        const document = new jsdom.JSDOM(body).window.document;
                        const vars = {};
                        for (let name in variables) {
                                vars[name] = document.getElementById(name).textContent;
                                if (variables[name]) vars[name] = variables[name](vars[name]);
                        }
                        return variable !== undefined ? vars[variable] : vars;
                });
        }

        loadFile(path) {
                const args = { path };
                const query = querystring.stringify(args);
                return this.doRequest({
                        path: endpoints.browser + '?' + query,
                });
        }
        
        /* Wrappers */
        
        isMuted() {
                return this.get('muted').then(v => v === '1');
        }

        setMute(val) {
                this.isMuted().then(muted => {
                        if ((muted && !val) || (!muted && val)) {
                                return this.toggleMute();
                        }
                });
        }
        
        getPlayState() {
                return this.get('statestring').then(v => v.toLowerCase());
        }

        isPlaying() {
                return this.get('statestring').then(v => v === 'Playing');
        }
        
        isPaused() {
                return this.get('statestring').then(v => v === 'Paused');
        }
        
        isStopped() {
                return this.get('statestring').then(v => v === 'Stopped');
        }
        
        isClosed() {
                return this.get('state').then(v => v === '-1');
        }
        
}


module.exports = { MediaPlayerClassicClient };
