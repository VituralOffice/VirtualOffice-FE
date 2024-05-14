interface ChatMenuProps {
  onClick: () => void
}
export const ChatMenu = ({ onClick }: ChatMenuProps) => {
  return (
    <span style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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
          onClick={onClick}
          type="button"
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
                width: '24px !important',
                color: 'rgb(255, 255, 255) !important',
                flexShrink: 0,
              }}
            >
              <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M13.657 8.172c0-2.526-2.66-4.572-5.943-4.572-3.283 0-5.943 2.046-5.943 4.572 0 .98.403 1.882 1.086 2.628a6.427 6.427 0 01-1.023 1.557.227.227 0 00-.043.249.224.224 0 00.209.137c1.046 0 1.911-.351 2.534-.714.92.448 2.009.714 3.18.714 3.283 0 5.943-2.046 5.943-4.571zm3.486 6.285c.683-.743 1.086-1.648 1.086-2.628 0-1.912-1.529-3.549-3.695-4.232.026.189.037.38.037.575 0 3.025-3.077 5.485-6.857 5.485-.308 0-.608-.023-.905-.054.9 1.643 3.014 2.797 5.477 2.797a7.23 7.23 0 003.18-.714c.623.363 1.488.714 2.534.714a.229.229 0 00.166-.386 6.362 6.362 0 01-1.023-1.557z"
                  fill="currentColor"
                />
              </svg>
            </span>
          </div>
        </button>
      </span>
    </span>
  )
}
export default ChatMenu
