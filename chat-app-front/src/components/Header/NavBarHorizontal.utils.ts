// MessageInput.utils.ts
import React from 'react';

export function validateMessage(text: string, image: File | null): boolean {
  return !!text.trim() || !!image;
}

export async function handleSubmitUtil(
  event: React.FormEvent<HTMLFormElement>,
  text: string,
  image: File | null,
  onSendMessage: (text: string, image: File | null) => Promise<void>,
  setText: (t: string) => void,
  setImage: (f: File | null) => void,
  setPreview: (url: string | null) => void
) {
  event.preventDefault();
  if (!validateMessage(text, image)) return;

  await onSendMessage(text, image);
  setText('');
  setImage(null);
  setPreview(null);

  const fileInput = event.currentTarget.querySelector('input[type="file"]') as HTMLInputElement;
  if (fileInput) fileInput.value = '';
}

export function handleFileChange(
  event: React.ChangeEvent<HTMLInputElement>,
  setImage: (f: File | null) => void,
  setPreview: (url: string | null) => void
) {
  const file = event.target.files?.[0];
  if (file) {
    setImage(file);
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
  } else {
    setImage(null);
    setPreview(null);
  }
}

export function handleKeyDown(
  event: React.KeyboardEvent<HTMLTextAreaElement>,
  text: string,
  image: File | null,
  submitFunction: () => void
) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    if (validateMessage(text, image)) {
      submitFunction();
    }
  }
}
