import styled from 'styled-components'
import SpaceDashboardSidebar from '../components/sidebars/SpaceDashboardSidebar'
import { useState } from 'react'
import PlansAndBilling from '../components/spacedashboard/PlansAndBilling'

const PageContainer = styled.div`
  display: flex;
  width: 100vw;
  height: 100%;
  overflow: hidden;
  background-color: rgb(51, 58, 100);
`

const PageContent = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: 32px;
  padding-right: 32px;
  width: 100%;
  max-width: 832px;
`

export default function SpaceDashboardPage() {
  const [menuId, setMenuId] = useState(0)

  const contents = [<PlansAndBilling />]

  return (
    <PageContainer>
      <SpaceDashboardSidebar menuId={menuId} setMenuId={setMenuId} />
      <div style={{ display: 'flex', flex: '1 1 0%', overflow: 'auto' }}>
        <PageContent>{contents[menuId]}</PageContent>
      </div>
    </PageContainer>
  )
}
