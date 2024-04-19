import { useEffect } from "react"
import phaserGame from "../PhaserGame";
import Bootstrap from "../scenes/Bootstrap";

export default function TestSpace() {
  useEffect(() => {
    const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap
    bootstrap.launchGame();

    return () => bootstrap.stopGame();
  }, []) // Chạy chỉ một lần khi ứng dụng khởi động
  return <></>
}
