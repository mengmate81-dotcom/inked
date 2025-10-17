export interface Ink {
  id: string;
  brand: string;
  name: string;
  color: string; // hex code
}

export interface Pen {
  id: string;
  brand: string;
  model: string;
  nib: {
    size: string;
    material: string;
    features?: string;
    writingFeel?: string;
  };
  inkId: string | null;
}