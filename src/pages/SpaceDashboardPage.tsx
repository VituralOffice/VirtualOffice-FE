import styled from "styled-components"
import SpaceDashboardSidebar from "../components/sidebars/SpaceDashboardSidebar"

const PageContainer = styled.div`
    display: flex;
    width: 100vw;
    height: 100%;
    overflow: hidden;
    background-color: rgb(51, 58, 100);
`

export default function SpaceDashboardPage() {
    return(
        <PageContainer>
            <SpaceDashboardSidebar menuId={0} />
            <div style={{display: 'flex', flex: '1 1 0%', overflow: 'auto'}}></div>
        </PageContainer>
    )
}