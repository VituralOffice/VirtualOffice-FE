import styled from "styled-components"
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { useState } from "react";

const OptionBoxComponent = styled.div`
    position: relative;
    box-sizing: border-box;
    width: 100%;
    .option-box-container {
        -webkit-box-align: center;
        align-items: center;
        cursor: pointer;
        display: flex;
        flex-wrap: wrap;
        -webkit-box-pack: justify;
        justify-content: space-between;
        min-height: 48px;
        position: relative;
        transition: all 0.2s ease -0.1s;
        background-color: rgb(84, 92, 143);
        border-color: transparent;
        border-radius: 12px;
        border-style: solid;
        border-width: 0px;
        box-shadow: none;
        box-sizing: border-box;
        opacity: 1;
        outline: 0px !important;

        &:hover {
            box-shadow: rgb(144, 173, 255) 0px 0px 0px 2px;
        }
        
        .current-selected {
            -webkit-box-align: center;
            align-items: center;
            display: grid;
            flex: 1 1 0%;
            flex-wrap: wrap;
            position: relative;
            overflow: hidden;
            padding: 2px 8px;
            box-sizing: border-box;
            .text {
                grid-area: 1 / 1 / 2 / 3;
                max-width: 100%;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                color: rgb(255, 255, 255);
                margin-left: 2px;
                margin-right: 2px;
                box-sizing: border-box;
                font-size: 15px;
                font-weight: 600;
            }
        }
        .icon-dropdown {
            -webkit-box-align: center;
            align-items: center;
            align-self: stretch;
            display: flex;
            flex-shrink: 0;
            box-sizing: border-box;
            &>div {
                display: flex;
                transition: color 150ms ease 0s;
                color: rgb(102, 102, 102);
                padding: 8px;
                box-sizing: border-box;
                &>span{
                    display: flex;
                    width: 24px;
                    color: rgb(67, 88, 216);
                    flex-shrink: 0;
                    transform: rotate(180deg);
                    &>svg{
                        width: 100%;
                        height: auto;
                        color: rgb(255, 255, 255);
                    }
                }
            }
        }
    }
    .dropdown-container {
        top: 100%;
        position: absolute;
        width: 100%;
        z-index: 1;
        background-color: rgb(235, 240, 255);
        border-radius: 12px;
        box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 4px 11px;
        margin-bottom: 8px;
        margin-top: 8px;
        box-sizing: border-box;
        overflow: hidden;
        &>div{
            max-height: 300px;
            overflow-y: auto;
            position: relative;
            box-sizing: border-box;
            padding: 8px 0px;
            .item {
                cursor: pointer;
                display: flex;
                font-size: 15px;
                width: 100%;
                user-select: none;
                -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
                background-color: rgb(235, 240, 255);
                color: rgb(32, 37, 64);
                padding: 8px 12px;
                box-sizing: border-box;
                font-weight: 600;
                line-height: 1.3;
                -webkit-box-pack: justify;
                justify-content: space-between;

                &:hover {
                    background-color: rgb(144, 173, 255);
                }
            }
        }
    }
`

export const OptionBox = ({ items, onSelect }) => {
    const [currentSelected, setCurrentSelected] = useState(0);
    const [dropdownShow, setDropdownShow] = useState(false);

    return (
        <OptionBoxComponent>
            <div className="option-box-container" onClick={() => setDropdownShow(!dropdownShow)}>
                <div className="current-selected">
                    <div className="text">{items[currentSelected]}</div>
                </div>
                <div className="icon-dropdown">
                    <div><span style={{ transform: dropdownShow ? 'rotate(180deg)' : 'rotate(0)' }}>
                        <KeyboardArrowDownRoundedIcon />
                    </span></div>
                </div>
            </div>
            {
                dropdownShow && <div className="dropdown-container">
                    <div>
                        {
                            items.map((value, index) => (
                                <div key={index} className="item" onClick={() => { setCurrentSelected(index); onSelect(index); setDropdownShow(false) }}>{value}</div>
                            ))
                        }
                    </div>
                </div>
            }
        </OptionBoxComponent >
    )
}