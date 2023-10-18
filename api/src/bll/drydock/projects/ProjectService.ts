export class ProjectService {
    public GetProjectCode(): string {
        return `DD-${this.IsVessel() ? 'V' : 'O'}-${Math.round(Math.random() * 1000 + 1)}`;
    }

    public IsVessel(): boolean {
        return false
    }


}
