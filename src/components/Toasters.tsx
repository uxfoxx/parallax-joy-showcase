import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";

/** Both toast hosts, in their own chunk: App mounts them once the page is
 *  idle, since nothing raises a toast before the visitor has done something. */
export default function Toasters() {
  return (
    <>
      <Toaster />
      <Sonner />
    </>
  );
}
