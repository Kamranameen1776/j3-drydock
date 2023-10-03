export class ExampleProjectsService {
    public GetOfficeVesselFirstLetter(createdAtOffice: boolean): string {
        return createdAtOffice ? 'O' : 'V';
    }

    public GetCode(projectTypeCode: string, createdAtOffice: boolean, projectShortCodeId: number): string {
        return projectTypeCode + '-' + this.GetOfficeVesselFirstLetter(createdAtOffice) + '-' + projectShortCodeId;
    }
}
