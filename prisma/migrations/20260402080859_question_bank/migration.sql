-- CreateTable
CREATE TABLE "Question" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "knowledgeUnit" TEXT NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 5,
    "creator" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "QuestionOption" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "content" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "order" INTEGER NOT NULL,
    "questionId" INTEGER NOT NULL,
    CONSTRAINT "QuestionOption_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SingleChoice" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "questionId" INTEGER NOT NULL,
    CONSTRAINT "SingleChoice_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MultipleChoice" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "questionId" INTEGER NOT NULL,
    CONSTRAINT "MultipleChoice_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Judgment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "answer" BOOLEAN NOT NULL,
    "questionId" INTEGER NOT NULL,
    CONSTRAINT "Judgment_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FillBlank" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "standardAnswer" TEXT NOT NULL,
    "questionId" INTEGER NOT NULL,
    CONSTRAINT "FillBlank_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Calculation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "standardProcess" TEXT,
    "standardAnswer" TEXT NOT NULL,
    "questionId" INTEGER NOT NULL,
    CONSTRAINT "Calculation_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ShortAnswer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "standardAnswer" TEXT NOT NULL,
    "questionId" INTEGER NOT NULL,
    CONSTRAINT "ShortAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "SingleChoice_questionId_key" ON "SingleChoice"("questionId");

-- CreateIndex
CREATE UNIQUE INDEX "MultipleChoice_questionId_key" ON "MultipleChoice"("questionId");

-- CreateIndex
CREATE UNIQUE INDEX "Judgment_questionId_key" ON "Judgment"("questionId");

-- CreateIndex
CREATE UNIQUE INDEX "FillBlank_questionId_key" ON "FillBlank"("questionId");

-- CreateIndex
CREATE UNIQUE INDEX "Calculation_questionId_key" ON "Calculation"("questionId");

-- CreateIndex
CREATE UNIQUE INDEX "ShortAnswer_questionId_key" ON "ShortAnswer"("questionId");
