const { createUploadthing } = require("uploadthing/next");
const { UploadThingError } = require("uploadthing/server");

const f = createUploadthing();

const auth = (req) => ({ id: "fakeId" });
const ourFileRouter = {
    imageUploader: f({ image: { maxFileSize: "4MB" } })
        .middleware(async ({ req }) => {
            const user = await auth(req);
            if (!user) throw new UploadThingError("Unauthorized");
            return { userId: user.id };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            return { uploadedBy: metadata.userId };
        }),
};
module.exports = { ourFileRouter };
