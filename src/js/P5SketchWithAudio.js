import React, { useRef, useEffect } from "react";
import "./helpers/Globals";
import "p5/lib/addons/p5.sound";
import * as p5 from "p5";
import { Midi } from '@tonejs/midi'
import PlayIcon from './functions/PlayIcon.js';
import ParticleSystem from './classes/ParticleSystem.js';
import ColourGenerator from './classes/ColourGenerator.js';

import audio from "../audio/circles-no-8.ogg";
import midi from "../audio/circles-no-8.mid";

/**
 * Circles No. 8
 * Inspiration: https://openprocessing.org/sketch/505090
 */
const P5SketchWithAudio = () => {
    const sketchRef = useRef();

    const Sketch = p => {

        p.canvas = null;

        p.canvasWidth = window.innerWidth;

        p.canvasHeight = window.innerHeight;

        p.audioLoaded = false;

        p.player = null;

        p.PPQ = 3840 * 4;

        p.loadMidi = () => {
            Midi.fromUrl(midi).then(
                function(result) {
                    console.log(result);
                    const noteSet1 = result.tracks[2].notes; // Sampler 1 - alone5 (Digital Love)
                    p.scheduleCueSet(noteSet1, 'executeCueSet1');
                    const noteSet2 = result.tracks[4].notes; // Synth 1 - Bluetag
                    p.scheduleCueSet(noteSet2, 'executeCueSet2');
                    const noteSet3 = result.tracks[11].notes; // Combinator 2 - Celtic Dream (Mod Wheel)
                    p.scheduleCueSet(noteSet3, 'executeCueSet3');
                    p.audioLoaded = true;
                    document.getElementById("loader").classList.add("loading--complete");
                    document.getElementById("play-icon").classList.remove("fade-out");
                }
            );
            
        }

        p.preload = () => {
            p.song = p.loadSound(audio, p.loadMidi);
            p.song.onended(p.logCredits);
        }

        p.scheduleCueSet = (noteSet, callbackName, poly = false)  => {
            let lastTicks = -1,
                currentCue = 1;
            for (let i = 0; i < noteSet.length; i++) {
                const note = noteSet[i],
                    { ticks, time } = note;
                if(ticks !== lastTicks || poly){
                    note.currentCue = currentCue;
                    p.song.addCue(time, p[callbackName], note);
                    lastTicks = ticks;
                    currentCue++;
                }
            }
        }

        p.colour = null;
        
        p.system = null;

        p.bgColourSet = [];

        p.currentBG = null;

        p.setup = () => {
            p.canvas = p.createCanvas(p.canvasWidth, p.canvasHeight);
            // p.colorMode(p.HSB);
            p.background(0, 0, 0);
            p.colour = new ColourGenerator(p)
            p.system = new ParticleSystem(p, p.colour);
            p.randomColor = require('randomcolor');
            p.bgColourSet = p.randomColor({luminosity: 'dark', count: 12});
            p.currentBG = p.random(p.bgColourSet);
        }

        p.draw = () => {
            if(p.audioLoaded && p.song.isPlaying()){
                p.system.update();   
            }
        }

        p.direction = 'left';

        p.x = 0;

        p.y = 0;

        p.moduloMap = 0;

        p.setNextLocation = () => {
            switch (p.direction) {
                case 'right':
                    p.x = p.map(p.moduloMap % 122880, 0, 122880, p.width - p.width / 32, 0 + p.width / 32)
                    p.y = p.random(0, p.height);
                    break;
                case 'down':
                    p.x = p.random(0, p.width);
                    p.y = p.map(p.moduloMap % 122880, 0, 122880, 0 + p.height / 32, p.height - p.height / 32)
                    break;
                case 'up':
                    p.x = p.random(0, p.width);
                    p.y = p.map(p.moduloMap % 122880, 0, 122880, p.width - p.height / 32, 0 + p.height / 32)
                    break;
                default:
                    p.x = p.map(p.moduloMap % 122880, 0, 122880, 0 + p.width / 32, p.width - p.width / 32)
                    p.y = p.random(0, p.height);
                    break;
            }
        }

        p.executeCueSet1 = (note) => {
            const { currentCue, ticks } = note;
            p.moduloMap = ticks % 122880;
            if(currentCue % 16 === 0) {
                if(currentCue < 80) {
                    p.background(0, 0, 0, 239);
                }
                p.system = new ParticleSystem(p, p.colour);
                p.direction = p.random(
                    ['left', 'right', 'down', 'up'].filter(d => d !== p.direction)
                );
            }
            
            p.setNextLocation();
            p.system.setColour(p.colour);
            p.system.addParticle(p.createVector(p.x, p.y));
        }

        p.executeCueSet2 = (note) => {
            const { currentCue } = note;
            if(currentCue % 2 === 0 && currentCue < 48) {
                p.currentBG = p.bgColourSet.filter(colour => colour !== p.currentBG);
                p.background(p.currentBG);
                p.system.updateParticleMinMaxSize();
            }
            p.setNextLocation();
            p.system.addParticle(p.createVector(p.x, p.y));
        }

        p.executeCueSet3 = (note) => {
            p.setNextLocation();
            p.system.addParticle(p.createVector(p.x, p.y));
        }

        p.hasStarted = false;

        p.mousePressed = () => {
            if(p.audioLoaded){
                if (p.song.isPlaying()) {
                    p.song.pause();
                } else {
                    if (parseInt(p.song.currentTime()) >= parseInt(p.song.buffer.duration)) {
                        p.reset();
                        if (typeof window.dataLayer !== typeof undefined){
                            window.dataLayer.push(
                                { 
                                    'event': 'play-animation',
                                    'animation': {
                                        'title': document.title,
                                        'location': window.location.href,
                                        'action': 'replaying'
                                    }
                                }
                            );
                        }
                    }
                    document.getElementById("play-icon").classList.add("fade-out");
                    p.canvas.addClass("fade-in");
                    p.song.play();
                    if (typeof window.dataLayer !== typeof undefined && !p.hasStarted){
                        window.dataLayer.push(
                            { 
                                'event': 'play-animation',
                                'animation': {
                                    'title': document.title,
                                    'location': window.location.href,
                                    'action': 'start playing'
                                }
                            }
                        );
                        p.hasStarted = false
                    }
                }
            }
        }

        p.creditsLogged = false;

        p.logCredits = () => {
            if (
                !p.creditsLogged &&
                parseInt(p.song.currentTime()) >= parseInt(p.song.buffer.duration)
            ) {
                p.creditsLogged = true;
                    console.log(
                    "Music By: http://labcat.nz/",
                    "\n",
                    "Animation By: https://github.com/LABCAT/"
                );
                p.song.stop();
            }
        };

        p.reset = () => {

        }

        p.updateCanvasDimensions = () => {
            p.canvasWidth = window.innerWidth;
            p.canvasHeight = window.innerHeight;
            p.canvas = p.resizeCanvas(p.canvasWidth, p.canvasHeight);
        }

        if (window.attachEvent) {
            window.attachEvent(
                'onresize',
                function () {
                    p.updateCanvasDimensions();
                }
            );
        }
        else if (window.addEventListener) {
            window.addEventListener(
                'resize',
                function () {
                    p.updateCanvasDimensions();
                },
                true
            );
        }
        else {
            //The browser does not support Javascript event binding
        }
    };

    useEffect(() => {
        new p5(Sketch, sketchRef.current);
    }, []);

    return (
        <div ref={sketchRef}>
            <PlayIcon />
        </div>
    );
};

export default P5SketchWithAudio;
