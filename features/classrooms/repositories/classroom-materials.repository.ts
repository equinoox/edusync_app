import { and, asc, eq } from 'drizzle-orm';

import { db } from '@/lib/db';
import {
  classrooms,
  lessonMaterials,
  lessons,
} from '@/lib/db/schema/classrooms';

export async function createLessonMaterialRecord(
  input: typeof lessonMaterials.$inferInsert,
) {
  const [material] = await db.insert(lessonMaterials).values(input).returning();
  return material;
}

export async function getLessonMaterialById(materialId: string) {
  const [material] = await db
    .select()
    .from(lessonMaterials)
    .where(eq(lessonMaterials.id, materialId))
    .limit(1);

  return material;
}

export async function getLessonMaterialWithLessonAndClassroom(materialId: string) {
  const [material] = await db
    .select({
      material: lessonMaterials,
      lesson: lessons,
      classroom: classrooms,
    })
    .from(lessonMaterials)
    .innerJoin(lessons, eq(lessons.id, lessonMaterials.lessonId))
    .innerJoin(classrooms, eq(classrooms.id, lessons.classroomId))
    .where(eq(lessonMaterials.id, materialId))
    .limit(1);

  return material;
}

export async function getLessonMaterialsByLessonId(lessonId: string) {
  return db
    .select()
    .from(lessonMaterials)
    .where(eq(lessonMaterials.lessonId, lessonId))
    .orderBy(asc(lessonMaterials.createdAt));
}

export async function getLessonMaterialsByClassroomId(classroomId: string) {
  return db
    .select({
      id: lessonMaterials.id,
      lessonId: lessonMaterials.lessonId,
      title: lessonMaterials.title,
      fileName: lessonMaterials.fileName,
      fileUrl: lessonMaterials.fileUrl,
      storageKey: lessonMaterials.storageKey,
      mimeType: lessonMaterials.mimeType,
      size: lessonMaterials.size,
      createdAt: lessonMaterials.createdAt,
      updatedAt: lessonMaterials.updatedAt,
    })
    .from(lessonMaterials)
    .innerJoin(lessons, eq(lessons.id, lessonMaterials.lessonId))
    .where(eq(lessons.classroomId, classroomId))
    .orderBy(asc(lessonMaterials.createdAt));
}

export async function deleteLessonMaterialRecord(
  materialId: string,
  lessonId: string,
) {
  const [material] = await db
    .delete(lessonMaterials)
    .where(
      and(
        eq(lessonMaterials.id, materialId),
        eq(lessonMaterials.lessonId, lessonId),
      ),
    )
    .returning();

  return material;
}
