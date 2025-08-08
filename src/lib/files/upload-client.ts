export type UploadProgress = {
  loaded: number;
  total?: number;
  percent?: number;
};

export type UploadOptions = {
  onProgress?: (p: UploadProgress) => void;
  signal?: AbortSignal;
  headers?: Record<string, string>;
};

/**
 * Uploade un fichier vers une URL présignée (PUT) avec suivi de progression.
 * Utilise XHR pour suivre le progrès.
 */
export async function uploadFileToPresignedUrl(
  file: File,
  uploadUrl: string,
  options: UploadOptions = {}
): Promise<Response> {
  const { onProgress, signal, headers } = options;

  const xhr = new XMLHttpRequest();

  const promise = new Promise<Response>((resolve, reject) => {
    try {
      xhr.open("PUT", uploadUrl, true);

      // Content-Type doit correspondre
      xhr.setRequestHeader("Content-Type", file.type || "application/octet-stream");
      if (headers) {
        for (const [k, v] of Object.entries(headers)) {
          xhr.setRequestHeader(k, v);
        }
      }

      xhr.upload.onprogress = (evt) => {
        if (!onProgress) return;
        const loaded = evt.loaded;
        const total = evt.lengthComputable ? evt.total : undefined;
        const percent = total ? Math.round((loaded / total) * 100) : undefined;
        onProgress({ loaded, total, percent });
      };

      xhr.onload = () => {
        const status = xhr.status;
        const ok = status >= 200 && status < 300;
        if (ok) {
          resolve(new Response(null, { status }));
        } else {
          reject(new Error(`Upload failed with status ${status}`));
        }
      };

      xhr.onerror = () => reject(new Error("Network error during upload"));
      xhr.onabort = () => reject(new Error("Upload aborted"));

      if (signal) {
        if (signal.aborted) {
          xhr.abort();
          return reject(new Error("Upload aborted"));
        }
        signal.addEventListener("abort", () => xhr.abort(), { once: true });
      }

      xhr.send(file);
    } catch (e) {
      reject(e);
    }
  });

  return promise;
}


