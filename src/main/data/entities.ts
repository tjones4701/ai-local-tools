import { Notification } from './entities/notifications.entity';
import { SourceCollection } from './entities/source-collection.entity';
import { SourcePart } from './entities/source-part.entity';
import { SourceVersion } from './entities/source-version.entity.ts';
import { Source } from './entities/source.entity';
import { User } from './entities/user.entity';

export const entities = [Notification, SourceCollection, SourcePart, SourceVersion, User, Source];
