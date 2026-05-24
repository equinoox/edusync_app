import { and, asc, eq } from 'drizzle-orm';

import { db } from '@/lib/db';
import {
  classroomMaterials,
  classrooms,
} from '@/lib/db/schema/classrooms';

export async function createClassroomMaterialRecord(
  input: typeof classroomMaterials.$inferInsert,
) {
  const [material] = await db.insert(classroomMaterials).values(input).returning();
  return material;
}

export async function getClassroomMaterialWithClassroom(materialId: string) {
  const [material] = await db
    .select({
      material: classroomMaterials,
      classroom: classrooms,
    })
    .from(classroomMaterials)
    .innerJoin(classrooms, eq(classrooms.id, classroomMaterials.classroomId))
    .where(eq(classroomMaterials.id, materialId))
    .limit(1);

  return material;
}

export async function getClassroomMaterialsByClassroomId(classroomId: string) {
  return db
    .select()
    .from(classroomMaterials)
    .where(eq(classroomMaterials.classroomId, classroomId))
    .orderBy(asc(classroomMaterials.createdAt));
}

export async function deleteClassroomMaterialRecord(
  materialId: string,
  classroomId: string,
) {
  const [material] = await db
    .delete(classroomMaterials)
    .where(
      and(
        eq(classroomMaterials.id, materialId),
        eq(classroomMaterials.classroomId, classroomId),
      ),
    )
    .returning();

  return material;
}
