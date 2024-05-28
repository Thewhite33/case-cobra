import { createUploadthing } from 'uploadthing/next';
import { z } from 'zod';
import sharp from 'sharp';

const f = createUploadthing();

export const ourFileRouter = {
    imageUploader: f({ image: { maxFileSize: '4MB' } })
        .input(z.object({ configId: z.string().optional() }))
        .middleware(async ({ input }) => {
            return { input };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            try {
                const { configId } = metadata.input;
                console.log('Upload complete metadata:', metadata);
                console.log('File:', file);
                return { configId };
            }catch (error) {
                console.error('Error in onUploadComplete:', error);
                throw error;
            }
        }),
};

export const OurFileRouter = ourFileRouter;
