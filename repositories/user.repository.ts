import {DefaultCrudRepository, repository, HasManyRepositoryFactory, HasOneRepositoryFactory} from '@loopback/repository';
import {User, UserRelations, ActivityEntry, FoodBookmark, Note, UserCharacteristics, UserLogin, UserCredential, Diabetes, Lifestyle, Anthropometry, Cholesterol, Exercise, BloodPressure, Calories, GlucoseManual, GlucoseDevices, InsulinInjections, UserBaseline, DrugEntry, FoodEntry, UserRole, HealthMarkerExtra, HealthMarkerInterval, Sharing, UserTwilioChatChannel, HealthMarkerMonitor, PasswordResetRequest, Step} from '../models';
import {MysqlDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {ActivityEntryRepository} from './activity-entry.repository';
import {FoodBookmarkRepository} from './food-bookmark.repository';
import {NoteRepository} from './note.repository';
import {UserCharacteristicsRepository} from './user-characteristics.repository';
import {UserLoginRepository} from './user-login.repository';
import {UserCredentialRepository} from './user-credential.repository';
import {DiabetesRepository} from './diabetes.repository';
import {LifestyleRepository} from './lifestyle.repository';
import {AnthropometryRepository} from './anthropometry.repository';
import {CholesterolRepository} from './cholesterol.repository';
import {ExerciseRepository} from './exercise.repository';
import {BloodPressureRepository} from './blood-pressure.repository';
import {CaloriesRepository} from './calories.repository';
import {GlucoseManualRepository} from './glucose-manual.repository';
import {GlucoseDevicesRepository} from './glucose-devices.repository';
import {InsulinInjectionsRepository} from './insulin-injections.repository';
import {UserBaselineRepository} from './user-baseline.repository';
import {DrugEntryRepository} from './drug-entry.repository';
import {FoodEntryRepository} from './food-entry.repository';
import {UserRoleRepository} from './user-role.repository';
import {HealthMarkerExtraRepository} from './health-marker-extra.repository';
import {HealthMarkerIntervalRepository} from './health-marker-interval.repository';
import {SharingRepository} from './sharing.repository';
import {UserTwilioChatChannelRepository} from './user-twilio-chat-channel.repository';
import {HealthMarkerMonitorRepository} from './health-marker-monitor.repository';
import {PasswordResetRequestRepository} from './password-reset-request.repository';
import {StepRepository} from './step.repository';

export type Credentials = {
  email: string;
  password: string;
};

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
> {

  public readonly activityEntries: HasManyRepositoryFactory<ActivityEntry, typeof User.prototype.id>;

  public readonly foodBookmarks: HasManyRepositoryFactory<FoodBookmark, typeof User.prototype.id>;

  public readonly notes: HasManyRepositoryFactory<Note, typeof User.prototype.id>;

  public readonly userCharacteristics: HasOneRepositoryFactory<UserCharacteristics, typeof User.prototype.id>;

  public readonly userLogins: HasManyRepositoryFactory<UserLogin, typeof User.prototype.id>;

  public readonly userCredential: HasOneRepositoryFactory<UserCredential, typeof User.prototype.id>;

  public readonly diabetes: HasManyRepositoryFactory<Diabetes, typeof User.prototype.id>;

  public readonly lifestyles: HasManyRepositoryFactory<Lifestyle, typeof User.prototype.id>;

  public readonly anthropometries: HasManyRepositoryFactory<Anthropometry, typeof User.prototype.id>;

  public readonly cholesterols: HasManyRepositoryFactory<Cholesterol, typeof User.prototype.id>;

  public readonly exercises: HasManyRepositoryFactory<Exercise, typeof User.prototype.id>;

  public readonly bloodPressures: HasManyRepositoryFactory<BloodPressure, typeof User.prototype.id>;

  public readonly calories: HasManyRepositoryFactory<Calories, typeof User.prototype.id>;

  public readonly glucoseManuals: HasManyRepositoryFactory<GlucoseManual, typeof User.prototype.id>;

  public readonly glucoseDevices: HasManyRepositoryFactory<GlucoseDevices, typeof User.prototype.id>;

  public readonly insulinInjections: HasManyRepositoryFactory<InsulinInjections, typeof User.prototype.id>;

  public readonly userBaseline: HasOneRepositoryFactory<UserBaseline, typeof User.prototype.id>;

  public readonly drugEntries: HasManyRepositoryFactory<DrugEntry, typeof User.prototype.id>;

  public readonly foodEntries: HasManyRepositoryFactory<FoodEntry, typeof User.prototype.id>;

  public readonly userRoles: HasManyRepositoryFactory<UserRole, typeof User.prototype.id>;

  public readonly healthMarkerExtras: HasManyRepositoryFactory<HealthMarkerExtra, typeof User.prototype.id>;

  public readonly healthMarkerIntervals: HasManyRepositoryFactory<HealthMarkerInterval, typeof User.prototype.id>;

  public readonly sharings: HasManyRepositoryFactory<Sharing, typeof User.prototype.id>;

  public readonly sharers: HasManyRepositoryFactory<Sharing, typeof User.prototype.id>;

  public readonly userTwilioChatChannels: HasManyRepositoryFactory<UserTwilioChatChannel, typeof User.prototype.id>;

  public readonly healthMarkerMonitors: HasManyRepositoryFactory<HealthMarkerMonitor, typeof User.prototype.id>;

  public readonly passwordResetRequests: HasManyRepositoryFactory<PasswordResetRequest, typeof User.prototype.id>;
  
  public readonly steps: HasManyRepositoryFactory<Step, typeof User.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('ActivityEntryRepository') protected activityEntryRepositoryGetter: Getter<ActivityEntryRepository>, @repository.getter('FoodBookmarkRepository') protected foodBookmarkRepositoryGetter: Getter<FoodBookmarkRepository>, @repository.getter('NoteRepository') protected noteRepositoryGetter: Getter<NoteRepository>, @repository.getter('UserCharacteristicsRepository') protected userCharacteristicsRepositoryGetter: Getter<UserCharacteristicsRepository>, @repository.getter('UserLoginRepository') protected userLoginRepositoryGetter: Getter<UserLoginRepository>, @repository.getter('UserCredentialRepository') protected userCredentialRepositoryGetter: Getter<UserCredentialRepository>, @repository.getter('DiabetesRepository') protected diabetesRepositoryGetter: Getter<DiabetesRepository>, @repository.getter('LifestyleRepository') protected lifestyleRepositoryGetter: Getter<LifestyleRepository>, @repository.getter('AnthropometryRepository') protected anthropometryRepositoryGetter: Getter<AnthropometryRepository>, @repository.getter('CholesterolRepository') protected cholesterolRepositoryGetter: Getter<CholesterolRepository>, @repository.getter('ExerciseRepository') protected exerciseRepositoryGetter: Getter<ExerciseRepository>, @repository.getter('BloodPressureRepository') protected bloodPressureRepositoryGetter: Getter<BloodPressureRepository>, @repository.getter('CaloriesRepository') protected caloriesRepositoryGetter: Getter<CaloriesRepository>, @repository.getter('GlucoseManualRepository') protected glucoseManualRepositoryGetter: Getter<GlucoseManualRepository>, @repository.getter('GlucoseDevicesRepository') protected glucoseDevicesRepositoryGetter: Getter<GlucoseDevicesRepository>, @repository.getter('InsulinInjectionsRepository') protected insulinInjectionsRepositoryGetter: Getter<InsulinInjectionsRepository>, @repository.getter('UserBaselineRepository') protected userBaselineRepositoryGetter: Getter<UserBaselineRepository>, @repository.getter('DrugEntryRepository') protected drugEntryRepositoryGetter: Getter<DrugEntryRepository>, @repository.getter('FoodEntryRepository') protected foodEntryRepositoryGetter: Getter<FoodEntryRepository>, @repository.getter('UserRoleRepository') protected userRoleRepositoryGetter: Getter<UserRoleRepository>, @repository.getter('HealthMarkerExtraRepository') protected healthMarkerExtraRepositoryGetter: Getter<HealthMarkerExtraRepository>, @repository.getter('HealthMarkerIntervalRepository') protected healthMarkerIntervalRepositoryGetter: Getter<HealthMarkerIntervalRepository>, @repository.getter('SharingRepository') protected sharingRepositoryGetter: Getter<SharingRepository>, @repository.getter('UserTwilioChatChannelRepository') protected userTwilioChatChannelRepositoryGetter: Getter<UserTwilioChatChannelRepository>, @repository.getter('HealthMarkerMonitorRepository') protected healthMarkerMonitorRepositoryGetter: Getter<HealthMarkerMonitorRepository>, @repository.getter('PasswordResetRequestRepository') protected passwordResetRequestRepositoryGetter: Getter<PasswordResetRequestRepository>, @repository.getter('StepRepository') protected stepRepositoryGetter: Getter<StepRepository>,
  ) {
    super(User, dataSource);
    this.passwordResetRequests = this.createHasManyRepositoryFactoryFor('passwordResetRequests', passwordResetRequestRepositoryGetter,);
    this.registerInclusionResolver('passwordResetRequests', this.passwordResetRequests.inclusionResolver);
    this.steps = this.createHasManyRepositoryFactoryFor('steps', stepRepositoryGetter,);
    this.registerInclusionResolver('steps', this.steps.inclusionResolver);
    this.healthMarkerMonitors = this.createHasManyRepositoryFactoryFor('healthMarkerMonitors', healthMarkerMonitorRepositoryGetter,);
    this.registerInclusionResolver('healthMarkerMonitors', this.healthMarkerMonitors.inclusionResolver);
    this.userTwilioChatChannels = this.createHasManyRepositoryFactoryFor('userTwilioChatChannels', userTwilioChatChannelRepositoryGetter,);
    this.registerInclusionResolver('userTwilioChatChannels', this.userTwilioChatChannels.inclusionResolver);
    this.sharers = this.createHasManyRepositoryFactoryFor('sharers', sharingRepositoryGetter,);
    this.registerInclusionResolver('sharers', this.sharers.inclusionResolver);
    this.sharings = this.createHasManyRepositoryFactoryFor('sharings', sharingRepositoryGetter,);
    this.registerInclusionResolver('sharings', this.sharings.inclusionResolver);
    this.healthMarkerIntervals = this.createHasManyRepositoryFactoryFor('healthMarkerIntervals', healthMarkerIntervalRepositoryGetter,);
    this.registerInclusionResolver('healthMarkerIntervals', this.healthMarkerIntervals.inclusionResolver);
    this.healthMarkerExtras = this.createHasManyRepositoryFactoryFor('healthMarkerExtras', healthMarkerExtraRepositoryGetter,);
    this.registerInclusionResolver('healthMarkerExtras', this.healthMarkerExtras.inclusionResolver);
    this.userRoles = this.createHasManyRepositoryFactoryFor('userRoles', userRoleRepositoryGetter,);
    this.registerInclusionResolver('userRoles', this.userRoles.inclusionResolver);
    this.foodEntries = this.createHasManyRepositoryFactoryFor('foodEntries', foodEntryRepositoryGetter,);
    this.registerInclusionResolver('foodEntries', this.foodEntries.inclusionResolver);
    this.drugEntries = this.createHasManyRepositoryFactoryFor('drugEntries', drugEntryRepositoryGetter,);
    this.registerInclusionResolver('drugEntries', this.drugEntries.inclusionResolver);
    this.userBaseline = this.createHasOneRepositoryFactoryFor('userBaseline', userBaselineRepositoryGetter);
    this.registerInclusionResolver('userBaseline', this.userBaseline.inclusionResolver);
    this.insulinInjections = this.createHasManyRepositoryFactoryFor('insulinInjections', insulinInjectionsRepositoryGetter,);
    this.registerInclusionResolver('insulinInjections', this.insulinInjections.inclusionResolver);
    this.glucoseDevices = this.createHasManyRepositoryFactoryFor('glucoseDevices', glucoseDevicesRepositoryGetter,);
    this.registerInclusionResolver('glucoseDevices', this.glucoseDevices.inclusionResolver);
    this.glucoseManuals = this.createHasManyRepositoryFactoryFor('glucoseManuals', glucoseManualRepositoryGetter,);
    this.registerInclusionResolver('glucoseManuals', this.glucoseManuals.inclusionResolver);
    this.calories = this.createHasManyRepositoryFactoryFor('calories', caloriesRepositoryGetter,);
    this.registerInclusionResolver('calories', this.calories.inclusionResolver);
    this.bloodPressures = this.createHasManyRepositoryFactoryFor('bloodPressures', bloodPressureRepositoryGetter,);
    this.registerInclusionResolver('bloodPressures', this.bloodPressures.inclusionResolver);
    this.exercises = this.createHasManyRepositoryFactoryFor('exercises', exerciseRepositoryGetter,);
    this.registerInclusionResolver('exercises', this.exercises.inclusionResolver);
    this.cholesterols = this.createHasManyRepositoryFactoryFor('cholesterols', cholesterolRepositoryGetter,);
    this.registerInclusionResolver('cholesterols', this.cholesterols.inclusionResolver);
    this.anthropometries = this.createHasManyRepositoryFactoryFor('anthropometries', anthropometryRepositoryGetter,);
    this.registerInclusionResolver('anthropometries', this.anthropometries.inclusionResolver);
    this.lifestyles = this.createHasManyRepositoryFactoryFor('lifestyles', lifestyleRepositoryGetter,);
    this.registerInclusionResolver('lifestyles', this.lifestyles.inclusionResolver);
    this.diabetes = this.createHasManyRepositoryFactoryFor('diabetes', diabetesRepositoryGetter,);
    this.registerInclusionResolver('diabetes', this.diabetes.inclusionResolver);
    this.userCredential = this.createHasOneRepositoryFactoryFor('userCredential', userCredentialRepositoryGetter);
    this.registerInclusionResolver('userCredential', this.userCredential.inclusionResolver);
    this.userLogins = this.createHasManyRepositoryFactoryFor('userLogins', userLoginRepositoryGetter,);
    this.registerInclusionResolver('userLogins', this.userLogins.inclusionResolver);
    this.userCharacteristics = this.createHasOneRepositoryFactoryFor('userCharacteristics', userCharacteristicsRepositoryGetter);
    this.registerInclusionResolver('userCharacteristics', this.userCharacteristics.inclusionResolver);
    this.notes = this.createHasManyRepositoryFactoryFor('notes', noteRepositoryGetter,);
    this.registerInclusionResolver('notes', this.notes.inclusionResolver);
    this.foodBookmarks = this.createHasManyRepositoryFactoryFor('foodBookmarks', foodBookmarkRepositoryGetter,);
    this.registerInclusionResolver('foodBookmarks', this.foodBookmarks.inclusionResolver);
    this.activityEntries = this.createHasManyRepositoryFactoryFor('activityEntries', activityEntryRepositoryGetter,);
    this.registerInclusionResolver('activityEntries', this.activityEntries.inclusionResolver);
  }

  async findCredentials(
    userId: typeof User.prototype.id,
  ): Promise<UserCredential | undefined> {
    try {
      return await this.userCredential(userId).get();
    } catch (err) {
      if (err.code === 'ENTITY_NOT_FOUND') {
        return undefined;
      }
      throw err;
    }
  }
}
