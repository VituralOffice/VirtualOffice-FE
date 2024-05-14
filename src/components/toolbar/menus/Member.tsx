interface MemberMenuProps {
  onClick: () => void
}
export const MemberMenu = ({ onClick }: MemberMenuProps) => {
  return (
    <span
      className="member-container"
      style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
    >
      <span color="#ffffff">
        <button
          style={{
            height: 40,
            padding: 8,
            display: 'flex',
            MozBoxAlign: 'center',
            alignItems: 'center',
            MozBoxPack: 'center',
            justifyContent: 'center',
            border: 'medium',
            borderRadius: 8,
            backgroundColor: 'rgb(84, 92, 143)',
            transition: 'background-color 200ms',
            cursor: 'pointer',
            position: 'relative',
          }}
          type="button"
          onClick={onClick}
          aria-label="Chat"
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            className="Layout"
          >
            <span
              style={{
                display: 'flex',
                width: 24,
                color: 'rgb(255, 255, 255)',
                flexShrink: 0,
              }}
            >
              <svg
                style={{ width: '100%', height: 'auto' }}
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.343 10c1.769 0 3.2-1.431 3.2-3.2 0-1.768-1.431-3.2-3.2-3.2a3.198 3.198 0 00-3.2 3.2c0 1.769 1.432 3.2 3.2 3.2zm2.194.914H8.3a4.5 4.5 0 01-1.957.457 4.51 4.51 0 01-1.957-.457h-.237a3.292 3.292 0 00-3.292 3.292v.823c0 .757.615 1.371 1.372 1.371h8.228c.758 0 1.372-.614 1.372-1.371v-.823a3.292 3.292 0 00-3.292-3.292zM14.572 10a2.744 2.744 0 10-.002-5.487A2.744 2.744 0 0014.572 10zm1.371.914h-.108a3.851 3.851 0 01-1.263.229 3.85 3.85 0 01-1.263-.229H13.2c-.583 0-1.12.169-1.591.44a4.181 4.181 0 011.134 2.852v1.097c0 .063-.014.123-.017.183h5.046c.757 0 1.371-.615 1.371-1.372 0-1.768-1.431-3.2-3.2-3.2z"
                  fill="currentColor"
                />
              </svg>
            </span>
            <div style={{ display: 'flex' }} className="Layout css-e2e9bo">
              <span
                style={{
                  display: 'flex',
                  width: 12,
                  color: 'rgb(6, 214, 160)',
                  flexShrink: 0,
                }}
              >
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M11.999 3.496A8.501 8.501 0 003.496 12 8.501 8.501 0 0012 20.502a8.501 8.501 0 008.503-8.503 8.501 8.501 0 00-8.503-8.503z"
                    fill="currentColor"
                  />
                </svg>
              </span>
              <span
                style={{
                  fontWeight: 700,
                  fontSize: 12,
                  letterSpacing: "0.03",
                  color: "#e0e0e0"
                }}
              >
                1
              </span>
            </div>
          </div>
        </button>
      </span>
    </span>
  )
}
export default MemberMenu
