import type { Resource } from "../types/resource";

const VITE_API_URL = import.meta.env.VITE_API_URL;

export default function ResoueceImage({ resource }: { resource: Resource }) {
  const imageUrl = `${VITE_API_URL}/resources/screenshots/${resource.id}`
  // const [imageUrl, setImageUrl] = useState('');
  // const [loaded, setLoaded] = useState(false);
  // const pollingRef = useRef<number | undefined>(undefined);

  // async function pollingImage() {
  //   if (!resource.id) return
  //   if (loaded) return;
  //   const data = await fetch(`${VITE_API_URL}/resources/screenshots/${resource.id}`)
  //   switch (data.status) {
  //     case 200:
  //       setLoaded(true);
  //       setImageUrl(`${VITE_API_URL}/resources/screenshots/${resource.id}`);
  //       break;
  //     default:
  //       setImageUrl('');
  //       setLoaded(false);
  //       setTimeout(() => {
  //         pollingImage()
  //       }, 300)
  //       break;
  //   };
  // };

  // useEffect(() => {
  //   setTimeout(() => {
  //     pollingImage()
  //   }, 300)
  // }, []);


  return (
    <div className="mt-3">
      <img
        src={imageUrl}
        alt="Source preview"
        className="w-full border border-slate-600 rounded bg-white"
      />
    </div>
  );
}
