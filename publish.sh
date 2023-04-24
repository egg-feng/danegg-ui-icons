pnpm i --frozen-lockfile
pnpm build

cd dist/icons-vue
npm config set registry https://registry.npmjs.org
npm login
npm publish
npm config set registry https://registry.npmmirror.com
echo "✅ Publish completed"
