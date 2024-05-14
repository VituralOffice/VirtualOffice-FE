interface MainMenuProps {
  onClick: () => void
}
export const MainMenu = ({ onClick }: MainMenuProps) => {
  return (
    <div
      onClick={onClick}
      className="main-menu"
      style={{ width: 50, height: 50, border: '1px solid black', margin: 'auto' }}
    />
  )
}
export default MainMenu
