import React, { useRef, useEffect, useState } from 'react';
import CharacterInfo from '../CharacterInfo/CharacterInfo';
import { Link, Outlet } from "react-router-dom";
import { collisionsArray } from '../../Data/Collision';
import { chestsArray } from '../../Data/Chest';
import Map from '../../../assets/img/demo-map.png'
import './GameMap.css'

function GameMap({ loadFile, setFadeIn }) {
    const [showGameMap, setShowGameMap] = useState(false)
    const [treasureChest, setTreasureChest] = useState(false)
    const [menu, setMenu] = useState(false)
    const canvasRef = useRef(null);
    console.log(treasureChest)

    useEffect(() => {
        setTimeout(() => {
            setShowGameMap(true)
        }, 2000)

        const fadeIn = setTimeout(() => {
            setFadeIn(true);
        }, 3000);

        return () => clearTimeout(fadeIn);
    }, [setFadeIn])

    useEffect(() => {
        function handleKeyPress(event) {
            if (event.key === 'Enter') { // toggle menu on 'm' key press
                setMenu(menu => !menu);
            }
        }

        document.addEventListener('keydown', handleKeyPress);

        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, []);

    useEffect(() => {
        function handleKeyPress(event) {
            if (treasureChest === true && event.key === 'r') { // toggle menu on 'm' key press
                console.log("Item")
            }
        }

        document.addEventListener('keydown', handleKeyPress);

        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, [treasureChest]);


    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        const collisionsMap = []
        for (let i = 0; i < collisionsArray.length; i += 64) {
            collisionsMap.push(collisionsArray.slice(i, 64 + i))
        }

        const chestsMap = []
        for (let i = 0; i < chestsArray.length; i += 64) {
            chestsMap.push(chestsArray.slice(i, 64 + i))
        }
        console.log(chestsMap)

        class Boundary {
            static width = 12
            static height = 12
            constructor({ position, symbol, name }) {
                this.position = position
                this.width = 12
                this.height = 12
                this.symbol = symbol
                this.name = name
            }

            draw() {
                ctx.fillStyle = 'transparent'
                ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
            }
        }


        const bounderies = []
        const offset = {
            x: -360,
            y: -40
        }

        collisionsMap.forEach((row, i) => {
            row.forEach((symbol, j) => {
                if (symbol === 8021)
                    bounderies.push(new Boundary({
                        position: {
                            x: j * Boundary.width + offset.x,
                            y: i * Boundary.height + offset.y
                        },
                    }))
            })
        })

        const chests = []

        chestsMap.forEach((row, i) => {
            row.forEach((symbol, j) => {
                if (symbol === 8021)
                    chests.push(new Boundary({
                        position: {
                            x: j * Boundary.width + offset.x,
                            y: i * Boundary.height + offset.y
                        },
                    }))
            })
        })

        const image = new Image()
        image.src = Map

        class Sprites {
            constructor({ position, image, frames = { max: 1 } }) {
                this.position = position
                this.image = image
                this.frames = { ...frames, val: 0, elapsed: 0 }

                this.image.onload = () => {
                    this.width = this.image.width / this.frames.max
                    this.height = this.image.height
                }
                this.moving = false
            }

            draw() {
                ctx.drawImage(
                    this.image,
                    this.frames.val * this.width, // source x coordinate
                    0, // source y coordinate
                    this.image.width / this.frames.max, // source width
                    this.image.height, // source height
                    this.position.x,
                    this.position.y,
                    this.image.width / this.frames.max, // destination width
                    this.image.height  // destination height
                )
                if (!this.moving) return
                if (this.frames.max > 1) {
                    this.frames.elapsed++
                }

                if (this.frames.elapsed % 10 === 0)
                    if (this.frames.val < this.frames.max - 1) this.frames.val++
                    else this.frames.val = 0
            }
        }
        const playerImage = new Image()
        loadFile.sex === "male" ? playerImage.src = loadFile.job_stats.male_job_sprite_down : playerImage.src = loadFile.job_stats.female_job_sprite_down

        const player = new Sprites({
            position: {
                x: canvas.width / 2, // destination x coordinate,
                y: canvas.height - 100 / 2, // destination y coordinate
            },
            image: playerImage,
            frames: {
                max: 3
            }
        })

        const background = new Sprites({
            position: {
                x: offset.x,
                y: offset.y
            },
            image: image
        })

        const keys = {
            w: {
                pressed: false
            },
            a: {
                pressed: false
            },
            s: {
                pressed: false
            },
            d: {
                pressed: false
            }
        }

        const movables = [background, ...bounderies, ...chests]

        function rectangularCollision({ rectangle1, rectangle2 }) {

            return (
                rectangle1.position.x + rectangle1.width >= rectangle2.position.x && rectangle1.position.x <= rectangle2.position.x + rectangle2.width && rectangle1.position.y <= rectangle2.position.y + rectangle2.height && rectangle1.position.y + rectangle1.height >= rectangle2.position.y
            )
        }

        function animate() {
            window.requestAnimationFrame(animate)
            background.draw()
            bounderies.forEach(boundary => {
                boundary.draw()
            })
            chests.forEach(chest => {
                chest.draw()
            })
            // Pass canvas dimensions as props to Player component
            player.draw()

            let moving = true
            player.moving = false
            if (keys.w.pressed && last_key === "w") {
                loadFile.sex === "male" ? playerImage.src = loadFile.job_stats.male_job_sprite_up : playerImage.src = loadFile.job_stats.female_job_sprite_up
                player.moving = true

                for (let i = 0; i < bounderies.length; i++) {
                    const boundary = bounderies[i]
                    if (boundary.symbol === 8022) {
                    }
                    if (
                        rectangularCollision({
                            rectangle1: player,
                            rectangle2: {
                                ...boundary, position: {
                                    x: boundary.position.x,
                                    y: boundary.position.y + 3
                                }
                            }
                        })
                    ) {
                        moving = false
                        break
                    }
                }

                for (let i = 0; i < chests.length; i++) {
                    const chest = chests[i]
                    if (
                        rectangularCollision({
                            rectangle1: player,
                            rectangle2: chest
                        })
                    ) {
                        moving = false
                        setTreasureChest(true)
                        break
                    } else {
                        setTreasureChest(false)

                    }
                }

                if (moving)
                    movables.forEach((movable) => {
                        movable.position.y += 3
                    })
            }
            else if (keys.a.pressed && last_key === "a") {
                loadFile.sex === "male" ? playerImage.src = loadFile.job_stats.male_job_sprite_left : playerImage.src = loadFile.job_stats.female_job_sprite_left
                player.moving = true
                for (let i = 0; i < bounderies.length; i++) {
                    const boundary = bounderies[i]
                    if (
                        rectangularCollision({
                            rectangle1: player,
                            rectangle2: {
                                ...boundary, position: {
                                    x: boundary.position.x + 3,
                                    y: boundary.position.y
                                }
                            }
                        })
                    ) {
                        moving = false
                        break
                    }
                }

                for (let i = 0; i < chests.length; i++) {
                    const chest = chests[i]
                    if (
                        rectangularCollision({
                            rectangle1: player,
                            rectangle2: chest
                        })
                    ) {
                        setTreasureChest(true)
                        break
                    } else {
                        setTreasureChest(false)

                    }
                }

                if (moving)
                    movables.forEach((movable) => {
                        movable.position.x += 3
                    })
            }
            else if (keys.s.pressed && last_key === "s") {
                loadFile.sex === "male" ? playerImage.src = loadFile.job_stats.male_job_sprite_down : playerImage.src = loadFile.job_stats.female_job_sprite_down
                player.moving = true
                for (let i = 0; i < bounderies.length; i++) {
                    const boundary = bounderies[i]
                    if (
                        rectangularCollision({
                            rectangle1: player,
                            rectangle2: {
                                ...boundary, position: {
                                    x: boundary.position.x,
                                    y: boundary.position.y - 3
                                }
                            }
                        })
                    ) {
                        moving = false
                        break
                    }
                }

                for (let i = 0; i < chests.length; i++) {
                    const chest = chests[i]
                    if (
                        rectangularCollision({
                            rectangle1: player,
                            rectangle2: chest
                        })
                    ) {
                        setTreasureChest(true)
                        break
                    } else {
                        setTreasureChest(false)

                    }
                }

                if (moving)
                    movables.forEach((movable) => {
                        movable.position.y -= 3
                    })
            }
            else if (keys.d.pressed && last_key === "d") {
                loadFile.sex === "male" ? playerImage.src = loadFile.job_stats.male_job_sprite_right : playerImage.src = loadFile.job_stats.female_job_sprite_right
                player.moving = true
                for (let i = 0; i < bounderies.length; i++) {
                    const boundary = bounderies[i]
                    if (
                        rectangularCollision({
                            rectangle1: player,
                            rectangle2: {
                                ...boundary, position: {
                                    x: boundary.position.x - 3,
                                    y: boundary.position.y
                                }
                            }
                        })
                    ) {
                        moving = false
                        break
                    }
                }

                for (let i = 0; i < chests.length; i++) {
                    const chest = chests[i]
                    if (
                        rectangularCollision({
                            rectangle1: player,
                            rectangle2: chest
                        })
                    ) {
                        setTreasureChest(true)
                        break
                    } else {
                        setTreasureChest(false)

                    }
                }

                if (moving)
                    movables.forEach((movable) => {
                        movable.position.x -= 3
                    })
            }

        }
        animate()

        let last_key = ""
        window.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'w':
                    keys.w.pressed = true
                    last_key = "w"
                    break
                case 'a':
                    keys.a.pressed = true
                    last_key = "a"
                    break
                case 's':
                    keys.s.pressed = true
                    last_key = "s"
                    break
                case 'd':
                    keys.d.pressed = true
                    last_key = "d"
                    break
            }
        })

        window.addEventListener('keyup', (e) => {
            switch (e.key) {
                case 'w':
                    keys.w.pressed = false
                    break
                case 'a':
                    keys.a.pressed = false
                    break
                case 's':
                    keys.s.pressed = false
                    break
                case 'd':
                    keys.d.pressed = false
                    break
            }

        })
    }, []);

    const showmap = !showGameMap ? "opacity-0" : "opacity-100"

    const openMenu = menu ? "opacity-100" : "opacity-0"

    return (
        <div className={`GameMap h-full w-full ${showmap}`}>
            <canvas ref={canvasRef}></canvas>
            <CharacterInfo />
            {treasureChest ? <h1 className='question-mark'>!</h1> : ""}
            <div className={`menu flex w-full h-full absolute top-0 bg-black ${openMenu}`}>
                <div className='basis-3/4 flex items-end p-20 text-white'>
                    <h1 className='text-5xl'>{loadFile.character_name}</h1>
                    <span>{loadFile.job_stats.job}</span>
                    <span>HP: {loadFile.job_stats.hp}</span>
                    <span>MP: {loadFile.job_stats.mg}</span>
                </div>
                <div className='basis-1/4 flex justify-center p-10 text-white flex-col justify-around'>
                    <ul>
                        <li>Items</li>
                        <li>Equipment</li>
                        <li>Jobs</li>
                        <li>Stats</li>
                    </ul>
                    <ul>
                        <li><Link to="/">Title Screen</Link></li>
                    </ul>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default GameMap;

