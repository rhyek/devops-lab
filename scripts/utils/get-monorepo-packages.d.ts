declare module 'get-monorepo-packages' {
  export default function getPackages(root: string): { location: string; package: { name: string } }[];
}
