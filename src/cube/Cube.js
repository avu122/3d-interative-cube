/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";
import gsap, { TimelineMax, Linear } from "gsap/all";
import { CSSPlugin } from 'gsap/CSSPlugin'
import { Draggable } from "gsap/Draggable";
import './cube.scss';

function Cube() {
    const dragInstance = useRef(null);
    // Force CSSPlugin to not get dropped during build
    gsap.registerPlugin(CSSPlugin)
    gsap.registerPlugin(Draggable);
    const [firstRender, setFirstRender] = useState(true);
    const boxRef = useRef();
    const dragger = useRef();
    let tlCube = new TimelineMax();
    let dur = 6, e = Linear.easeNone;
    let pos = { x: 0, y: 0 }

    const boxRotation = (box) => {
        gsap.set(box, { rotation: 0, rotationX: -22.5, rotationY: 145 });
        tlCube
            .to(box, dur, {
                rotationY: '+=360',
                ease: e
            })
            .to(box, dur, {
                rotationX: '+=360',
                ease: e
            })
            .repeat(-1).play()
    }

    useEffect(() => {
        dragInstance.current = Draggable.create(dragger.current, {
            onDragStart: (e) => {
                if (e.touches) {// on mobile, convert the touch x/y
                    e.clientX = e.touches[0].clientX;
                    e.clientY = e.touches[0].clientY;
                }
                pos.x = Math.round(e.clientX);
                pos.y = Math.round(e.clientY);
            },

            onDrag: (e) => {
                if (e.touches) {// on mobile, convert the touch x/y
                    e.clientX = e.touches[0].clientX;
                    e.clientY = e.touches[0].clientY;
                }

                let ry = Math.abs(gsap.getProperty(boxRef.current, 'rotationY') % 360),
                    rxDir = (ry > 90 && ry < 270) ? '+=' : '-='; // feels more intuitive to invert rotationX when cube is turned backwards
                gsap.to(boxRef.current, {
                    rotation: 0,
                    rotationX: rxDir + (Math.round(e.clientY) - pos.y),
                    rotationY: '+=' + ((Math.round(e.clientX) - pos.x) % 360),
                    ease: e
                });
                pos.x = Math.round(e.clientX);
                pos.y = Math.round(e.clientY);
            },

            onDragEnd: () => { // reset drag layer
                gsap.set(dragger.current, { x: 0, y: 0 });
                setTimeout(() => {
                    gsap.set(dragger.current, { zIndex: -1 })
                    boxRotation(boxRef.current);
                }, 3000);
            }
        })
    })

    useEffect(() => {
        if (firstRender) {
            const box = boxRef.current;
            setTimeout(() => {
                boxRotation(box);
            }, 2000);
        }
    }, [firstRender]);

    const onMouseDown = async () => {
        dragInstance.current[0].disable();
        setFirstRender(false);
        tlCube.pause();
        gsap.set(dragger.current, { zIndex: 1 })
        gsap.set(dragger.current, { rotationX: 0, rotationY: 0 });
        await dragInstance.current[0].enable();
    }

    return (
        <div id="wrapper">
            <div className="viewport">
                <div id="box"
                    className="box"
                    ref={boxRef}
                    onMouseDown={onMouseDown}
                // onMouseUp={onMouseUp}
                // onMouseMove={onMouseMove}
                >
                    <div className="side side__top">
                        <div className="side-image"></div>
                    </div>
                    <div className="side side__front">
                        <div className="side-div"></div>
                        <div className="side-small-image"></div>
                    </div>
                    <div className="side side__left">
                        <div className="side-div"></div>
                        <div className="side-small-image"></div>
                    </div>
                    <div className="side side__back">
                        <div className="side-div"></div>
                        <div className="side-small-image"></div>
                    </div>
                    <div className="side side__right">
                        <div className="side-div"></div>
                        <div className="side-small-image"></div>
                    </div>
                    <div className="side side__bottom">
                        <div className="side-image active"></div>
                    </div>
                    <div className="box__lid--side box__lid--front"></div>
                    <div className="box__lid--side box__lid--left"></div>
                    <div className="box__lid--side box__lid--back"></div>
                    <div className="box__lid--side box__lid--right"></div>
                    <div className="box__lid--top"></div>
                </div>
                <div className="draggable" ref={dragger}></div>
                <div className="boxShadow"></div>
            </div>
        </div>
    );
}

export default Cube;