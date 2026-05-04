/*
  Warnings:

  - You are about to drop the column `creator` on the `Question` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "role" TEXT NOT NULL DEFAULT 'STUDENT',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "QuizRecord" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "score" INTEGER NOT NULL,
    "totalScore" INTEGER NOT NULL,
    "knowledgeUnit" TEXT NOT NULL,
    "completedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "studentId" INTEGER NOT NULL,
    CONSTRAINT "QuizRecord_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Question" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "knowledgeUnit" TEXT NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 5,
    "creatorId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Question_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Question" ("createdAt", "id", "knowledgeUnit", "level", "score", "title", "type", "updatedAt") SELECT "createdAt", "id", "knowledgeUnit", "level", "score", "title", "type", "updatedAt" FROM "Question";
DROP TABLE "Question";
ALTER TABLE "new_Question" RENAME TO "Question";
CREATE INDEX "Question_title_idx" ON "Question"("title");
CREATE INDEX "Question_type_idx" ON "Question"("type");
CREATE INDEX "Question_knowledgeUnit_idx" ON "Question"("knowledgeUnit");
CREATE INDEX "Question_creatorId_idx" ON "Question"("creatorId");
CREATE TABLE "new_QuestionOption" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "content" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "questionId" INTEGER NOT NULL,
    CONSTRAINT "QuestionOption_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_QuestionOption" ("content", "id", "isCorrect", "order", "questionId") SELECT "content", "id", "isCorrect", "order", "questionId" FROM "QuestionOption";
DROP TABLE "QuestionOption";
ALTER TABLE "new_QuestionOption" RENAME TO "QuestionOption";
CREATE INDEX "QuestionOption_questionId_idx" ON "QuestionOption"("questionId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "QuizRecord_studentId_idx" ON "QuizRecord"("studentId");

-- CreateIndex
CREATE INDEX "QuizRecord_knowledgeUnit_idx" ON "QuizRecord"("knowledgeUnit");
