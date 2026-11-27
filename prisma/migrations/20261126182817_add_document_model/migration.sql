-- CreateTable
CREATE TABLE "Document" (
    "id" SERIAL NOT NULL,
    "docId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "structure" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Document_docId_key" ON "Document"("docId");
