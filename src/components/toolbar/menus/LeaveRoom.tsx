interface LeaveRoomMenuProps {
  onClick: () => void
}
export const LeaveRoomMenu = ({ onClick }: LeaveRoomMenuProps) => {
  return (
    <span
      className="leave-container"
      style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
    >
      <span>
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
        >
          <span
            style={{
              display: 'flex',
              width: 32,
              color: 'rgb(255, 255, 255)',
              flexShrink: 0,
            }}
            width="32px"
            color="#ffffff"
          >
            <svg viewBox="0 0 33 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M21.423 15.583H18.68V4.113c0-.935-.738-1.696-1.646-1.696h-3.84V4.61h3.291v13.166h4.938a.548.548 0 00.548-.549v-1.097a.548.548 0 00-.548-.548zM10.733.257L4.152 1.963a1.13 1.13 0 00-.831 1.103v12.517H.577a.548.548 0 00-.549.548v1.097c0 .303.246.549.549.549h11.52V1.36c0-.74-.67-1.282-1.363-1.103zm-1.653 9.84c-.455 0-.823-.491-.823-1.097s.368-1.097.823-1.097c.454 0 .823.49.823 1.097 0 .606-.369 1.097-.823 1.097z"
                fill="currentColor"
              />
              <path stroke="#fff" strokeWidth={2} strokeLinecap="round" d="M22 10h5" />
              <path
                d="M32.5 9.134a1 1 0 010 1.732L28 13.464a1 1 0 01-1.5-.866V7.402a1 1 0 011.5-.866l4.5 2.598z"
                fill="#fff"
              />
            </svg>
          </span>
        </button>
      </span>
    </span>
  )
}
export default LeaveRoomMenu
