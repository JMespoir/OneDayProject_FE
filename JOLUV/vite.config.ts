import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // '/api'로 시작하는 요청을 만나면 target 주소로 바꿔치기합니다.
      '/api': {
        target: 'http://43.201.44.27:8080', // 백엔드 주소
        changeOrigin: true,
        //rewrite: (path) => path.replace(
        //    /^\/api/, ''), // '/api' 글자를  보냄
        secure: false,
      },
    },
  },
})