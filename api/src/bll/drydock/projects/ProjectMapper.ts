import { IProjectsFromMainPageRecordDto } from '../../../application-layer/drydock/projects/projects-for-main-page/dtos/IProjectsFromMainPageRecordDto';
import { IProjectsForMainPageRecordDto } from '../../../dal/drydock/projects/dtos/IProjectsForMainPageRecordDto';

export class ProjectMapper {
    public map(record: IProjectsForMainPageRecordDto): IProjectsFromMainPageRecordDto {
        return {
            ProjectId: record.ProjectId,
            ProjectCode: record.ProjectCode,
            ProjectTypeName: record.ProjectTypeName,
            ProjectTypeCode: record.ProjectTypeCode,
            ProjectManager: record.ProjectManager,
            ProjectManagerUid: record.ProjectManagerUid,

            ShipYard: record.ShipYard,
            ShipYardId: record.ShipYardUid,
            Specification: record.Specification,
            ProjectStatusName: record.ProjectStatusName,
            ProjectStatusId: record.ProjectStatusId,

            ProjectState: record.ProjectStateName,

            VesselName: record.VesselName,
            VesselUid: record.VesselUid,
            VesselId: record.VesselId,
            VesselType: record.VesselType,

            Subject: record.Subject,
            StartDate: record.StartDate,
            EndDate: record.EndDate,
            TaskManagerUid: record.TaskManagerUid,
        };
    }
}
