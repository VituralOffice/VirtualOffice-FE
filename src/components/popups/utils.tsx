import styled from "styled-components";

const PopupContainerComponent = styled.div`
    position: absolute;
    bottom: calc(100% + 10px);
    z-index: 8;
    width: max-content;
    &>div {
        pointer-events: auto;
        opacity: 1;
        &>div {
            display: flex;
            background-color: rgb(40, 45, 78);
            flex-direction: column;
            padding: 0px;
            border-radius: 16px;
            z-index: 8;
            position: relative;
            overflow: visible;
            box-shadow: rgba(0, 0, 0, 0.55) 0px 10px 25px;
            border: 1px solid rgb(62, 71, 124);
            width: 335px;
            &>div {
                display: block;
                padding: 16px;
                &>div {
                    display: flex;
                    flex-direction: column;
                    max-height: 800px;
                    overflow-y: auto;
                    gap: 16px;
                    > * {
                        border-bottom: 2px solid rgba(255, 255, 255, 0.1);
                        padding-bottom: 16px;
                      }
                    
                      > *:last-child {
                        border-bottom: 0px solid rgba(255, 255, 255, 0.1);
                        padding-bottom: 0px;
                      }
                }
            }
        }
    }
`

export function PopupContainer({ children }) {
    return <PopupContainerComponent>
        <div><div><div><div>{children}</div></div></div></div>
    </PopupContainerComponent>
}

export const PopupContentSession = styled.div`
    display: flex;
    
    flex-direction: column;
`

const PopupContentHeaderComponent = styled.div`
display: flex;
flex-direction: row;
align-items: center;
margin-bottom: 4px;
.icon {
    display: flex;
    width: 24px;
    color: rgb(255, 255, 255);
    flex-shrink: 0;
    &>svg {
        width: 100%;
        height: auto;
    }
}
.title {
    color: rgb(255, 255, 255);
    font-weight: 700;
    font-size: 15px;
    line-height: 20px;
    margin-left: 8px;
}
`

export function PopupContentHeader({ icon, title }) {
    return (
        <PopupContentHeaderComponent>
            <span className="icon">{icon}</span>
            <span className="title">{title}</span>
        </PopupContentHeaderComponent>
    )
}

const PopupContentSelectableItemComponent = styled.div`
display: flex;
flex-direction: row;
padding: 6px 8px;
margin: 4px 0px;
border-radius: 8px;
flex-direction: row;
-webkit-box-align: center;
align-items: center;
width: 100%;
-webkit-box-pack: justify;
justify-content: space-between;
transition: background-color 200ms ease 0s;
cursor: pointer;
&:hover {
    background-color: rgb(84, 92, 143);
}
.title {
    color: rgb(224, 224, 224);
    font-family: "DM Sans", sans-serif;
    font-weight: 500;
    font-size: 15px;
    line-height: 20px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
}
.icon {
    display: flex;
    width: 20px;
    color: rgb(6, 214, 160);
    flex-shrink: 0;
    &>svg {
        width: 100%;
        height: auto;
    }
}
`

export function PopupContentSelectableItem({ title, icon, selected, onSelect }) {
    return (
        <PopupContentSelectableItemComponent onClick={onSelect}>
            <span className="title">{title}</span>
            {selected && <span className="icon">{icon}</span>}
        </PopupContentSelectableItemComponent>
    )
}