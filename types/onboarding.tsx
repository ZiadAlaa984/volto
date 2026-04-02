// ─── Shared form data ─────────────────────────────────────────────────────────
 
export interface LinkItem {
  title: string;
  url: string;
}
 
export interface FormData {
  slug: string;
  name: string;
  bio: string;
  links: LinkItem[];
}
 
// ─── Every step gets these props ──────────────────────────────────────────────
 
export interface StepProps {
  formData: FormData;
  onNext: (data?: Partial<FormData>) => void;
  onBack: () => void;
}
 
